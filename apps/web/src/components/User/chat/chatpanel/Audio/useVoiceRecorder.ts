import React, { useCallback, useEffect, useRef, useState } from 'react';

const useVoiceRecorder = () => {
  const [state, setState] = useState<{ isRecording: boolean; isPaused: boolean; error?: boolean | undefined }>({
    isPaused: false,
    isRecording: false,
    error: undefined,
  });

  const recorderRef: React.MutableRefObject<MediaRecorder | null> = useRef(null);

  const [chunks, setChunks] = useState<ArrayBuffer[]>([]);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [time, setTime] = useState<number>(0);

  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const _startTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    return () => clearInterval(interval);
  }, [timerInterval]);

  const _stopTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    return () => {
      if (timerInterval) return clearInterval(timerInterval);
    };
  }, [timerInterval]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRecording) {
      interval = setInterval(() => {
        if (recorderRef.current?.requestData) {
          recorderRef.current?.requestData();
        }
      }, 100);
    } else {
      clearInterval(interval!);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRecording, timerInterval]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorderRef.current = recorder;

      // starting recording
      recorder.start();

      recorder.onstart = (e) => {
        _startTimer();
        setState((prev) => {
          return { ...prev, isRecording: true };
        });
      };

      recorder.onstop = () => {
        if (timerInterval) _stopTimer();
        setState((prev) => {
          return { ...prev, isPaused: true, isRecording: false };
        });
      };

      // when the data is available then get the audio
      recorder.ondataavailable = async (e) => {
        const newChunks = await e.data.arrayBuffer();
        setChunks((prev) => [...prev, newChunks]);
      };
    } catch (error) {
      setState((prev) => {
        return { ...prev, error: true };
      });
    }
  }, [_startTimer, _stopTimer, timerInterval]);

  // toggle pause resume function
  const pauseResume = useCallback(() => {
    if (state.isPaused) {
      setState({ isPaused: false, isRecording: false });
      start();
    } else {
      _stopTimer();
      recorderRef.current?.requestData();
      recorderRef.current?.stop();
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
    }
  }, [_stopTimer, chunks, start, state.isPaused]);

  const stop = () => {
    if (state.isRecording) {
      recorderRef.current?.stop();
      const audioBlob = new Blob(chunks, { type: 'audio/webm' }); // Create audio blob from accumulated chunks
      setAudioBlob(audioBlob); // Set the audio blob
      setState({ isPaused: true, isRecording: false }); // Update state
    }
  };

  return { start, pauseResume, stop, chunks, audioBlob, mediaRecorder: recorderRef.current, time, ...state };
};

export default useVoiceRecorder;

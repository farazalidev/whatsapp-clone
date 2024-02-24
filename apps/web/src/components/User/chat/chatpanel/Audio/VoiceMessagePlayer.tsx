'use client';
import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import React, { FC, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface IVoiceMessagePlayerProps extends IAudioLoadingFallbackProps {
    height: number;
    width: number;
    loading: boolean;
    barColor: string;
    progressColor: string;
    id: string
    url: string
}

const VoiceMessagePlayer: FC<IVoiceMessagePlayerProps> = (props) => {
    const waveFormRef = useRef<HTMLDivElement>(null);

    const [waveFormObject, setWaveFormObject] = useState<WaveSurfer | null>(null);

    const [loaded, setLoaded] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (waveFormRef.current && !waveFormObject) {
            setWaveFormObject(
                WaveSurfer.create({
                    container: `#waveform-${props.id}`,
                    autoCenter: true,
                    cursorColor: 'gray',
                    cursorWidth: props.barWidth === 1 ? 1 : props.barWidth - 1,
                    waveColor: props.barColor || '#211027',
                    progressColor: props.progressColor || '#69207F',
                    normalize: true,
                    barGap: props.barGap,
                    height: props.height - 10,
                    barWidth: props.barWidth,
                    width: props.width - 50,
                    barRadius: 10,
                    fillParent: true,


                }),
            );
        }
    }, [props, waveFormObject]);

    useEffect(() => {
        const init = async () => {
            if (waveFormObject && waveFormRef.current) {
                try {
                    await waveFormObject.load(props.url);
                    setLoaded(true);
                } catch (error) {
                    return;
                }
            }
        };
        init();
    }, [props.url, waveFormObject]);

    useEffect(() => {
        waveFormObject?.on("finish", () => {
            setIsPlaying(false)
        })
    })

    const handlePlay = () => {
        if (waveFormObject) {
            waveFormObject.play();
            setIsPlaying(true)
        }
    };

    const handleStop = () => {
        if (waveFormObject) {
            waveFormObject.pause()
            setIsPlaying(false)
        }
    }



    return (
        <div className={`h-[${props.height}px] w-[${props.width}px] flex place-items-center`}>
            <div className="flex w-full place-items-center justify-between px-2 gap-2">
                {isPlaying ? (
                    <>
                        <OptionIcon
                            src="/icons/voice recorder/player-stop.svg"
                            className={` transition-opacity${props.loading ? 'cursor-not-allowed opacity-40' : 'opacity-100'}`}
                            onClick={handleStop}
                        />
                    </>
                ) : (
                    <OptionIcon
                        src="/icons/voice recorder/play.svg"
                        className={` transition-opacity${props.loading ? 'cursor-not-allowed opacity-40' : 'opacity-100'}`}
                        onClick={handlePlay}
                    />
                )}
                {!loaded ? <AudioLoadingFallback {...props} width={props.width - 50} /> : null}
                <div key={props.id} id={`waveform-${props.id}`} className={`w-[${props.width - 50}] ${!loaded ? 'hidden' : ''}`} ref={waveFormRef}></div>
            </div>
        </div>
    );
};

export default VoiceMessagePlayer;

interface IAudioLoadingFallbackProps {
    width: number;
    barWidth: number;
    barGap: number;
    height: number;
    color: string;
}

const AudioLoadingFallback: FC<IAudioLoadingFallbackProps> = ({ width, barWidth, barGap, height, color = 'black' }) => {
    const numBars = Math.floor(width / (barWidth + barGap)); // Calculate the number of bars based on available width
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, width, 5); // Clear the canvas before drawing

                for (let i = 0; i < numBars; i++) {
                    const x = i * (barWidth + barGap) + barWidth / 2; // Calculate the x-coordinate of the center of each circle
                    const y = height / 2; // Set the y-coordinate to half the canvas height

                    ctx.beginPath();
                    ctx.fillStyle = color;
                    ctx.arc(x, y, barWidth / 2, 0, Math.PI * 2); // Use calculated x and y coordinates
                    ctx.fill();
                }
            }
        }
    }, [barGap, barWidth, color, numBars, height, width]);

    return (
        <canvas ref={canvasRef} width={width} height={height}></canvas> // Set canvas height explicitly
    );
};

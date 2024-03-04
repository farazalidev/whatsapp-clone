export async function checkAudioDevice() {
  try {
    // Check if MediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return 'Fail: MediaDevices API not supported';
    }

    // Enumerate devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    let audioDeviceConnected = false;

    // Loop through devices to find audio input devices
    devices.forEach((device) => {
      if (device.kind === 'audioinput') {
        audioDeviceConnected = true;
      }
    });

    if (audioDeviceConnected) {
      try {
        // Attempt to access user media to check permissions
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return 'Success: Audio device connected';
      } catch (error: any) {
        if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
          return 'Denied: Permission denied for audio device';
        } else {
          return 'Fail: Error accessing audio device';
        }
      }
    } else {
      return 'Fail: No audio device connected';
    }
  } catch (error) {
    return 'Fail: Error accessing media devices';
  }
}

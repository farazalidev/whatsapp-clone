import { useEffect, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import Typography from '@/Atoms/Typography/Typography';
import { convertSeconds } from './formateSeconds';

const Player = ({ url }: { url: string }) => {

  const [audioTrack, setAudioTrack] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'white',
      progressColor: '#8696A0',
      width: 180,
      height: 30,
      normalize: true,
      barGap: 3,
      barWidth: 4,
      interact: true,
      dragToSeek: true,
    })
    wavesurfer.load(url)
    setAudioTrack(wavesurfer)
  }, [])

  const handlePlay = () => {
    audioTrack?.play()
    setIsPlaying(true)
  }
  const handlePause = () => {
    audioTrack?.pause()
    setIsPlaying(false)
  }


  return (
    <div className='bg-whatsapp-misc-playerBg rounded-full w-full h-full flex place-items-center justify-between p-3'>
      {isPlaying ? <OptionIcon src='/icons/voice recorder/player-stop.svg' onClick={handlePause} /> :
        <OptionIcon src='/icons/voice recorder/play.svg' onClick={handlePlay} />}
      <div id='waveform'></div>
      <Typography>
        {convertSeconds(Math.floor(Number(audioTrack?.getDuration())))}
      </Typography>
    </div>
  )
}

export default Player

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { useSongInfo } from "../hooks/useSongInfo";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
  FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon,
  RewindIcon, VolumeUpIcon, SwitchHorizontalIcon
} from "@heroicons/react/solid";
import { debounce } from "lodash";

export default function Player() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setCurrectTrackId] = useRecoilState(currentTrackState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack({}).then((data) => {
        console.log('successfully retrieved current track')
        setCurrectTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          console.log('successfully retrieved currentplayback state')
          setIsPlaying(data.body?.is_playing);
        });
      }).catch((err) => console.log('there was an error in player file line 34', err));
    }
  }, [songInfo, spotifyApi, setCurrectTrackId, setIsPlaying]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session, fetchCurrentSong]);

  const handlePlayPause = async () => {
    try {
      const data = await spotifyApi.getMyCurrentPlaybackState();

      console.log('data', data);
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('something went wrong', error);
    }
  };

  const debouncedAdjustVolume = useCallback(() => {
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch(err => { throw err });
    }, 500);
  }, [spotifyApi]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xl md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images?.[0]?.url} alt="Song Cover" />
        <div>
          <h3>{songInfo?.name}</h3>
          <div>
            <p>{songInfo?.artists?.[0]?.name}</p>
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => spotifyApi.skipToPrevious()} // does not currently function on spotify api
          className="button"
        />
        {isPlaying
          ? (<PauseIcon
            onClick={handlePlayPause}
            className="button w-10 h-10"
          />)
          : (<PlayIcon
            onClick={handlePlayPause}
            className="button w-10 h-10"
          />)
        }

        <FastForwardIcon
          onClick={() => spotifyApi.skipToNext()} // does not currently function on spotify api
          className="button"
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end">
        <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="button" />
        <input
          className="w-14 md:w-20"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="button" />
      </div>
    </div>
  );
}
// dependencies
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import {
  HomeIcon, SearchIcon, LibraryIcon,
  PlusCircleIcon, HeartIcon, RssIcon,
} from '@heroicons/react/outline';
// utils
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom';

function Button({ title, Icon, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center space-x-2 hover:text-white">
      <Icon className="h-5 w-5" />
      <p>{title}</p>
    </button>
  );
}

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline pb-36">
      <div className="space-y-3">
        <Button title="Home" Icon={HomeIcon} />
        <Button title="Search" Icon={SearchIcon} />
        <Button title="Your Library" Icon={LibraryIcon} />
        <hr className="border-t-[0.1px] border-gray-900" />
        <Button title="Create Playlist" Icon={PlusCircleIcon} />
        <Button title="Liked Songs" Icon={HeartIcon} />
        <Button title="Your Episodes" Icon={RssIcon} />
        <hr className="border-t-[0.1px] border-gray-900" />
      </div>

      {playlists.map((playlist) => (
        <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">
          {playlist.name}
        </p>
      ))}
      
    </div>
  );
}

export default Sidebar;

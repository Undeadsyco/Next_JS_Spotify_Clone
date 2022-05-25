import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import spotifyApi from '../lib/spotify';

export default function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === 'RefreshAccessTokenError') {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session])

  return spotifyApi;
}
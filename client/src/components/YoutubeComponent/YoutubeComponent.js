import YouTube from 'react-youtube';

const YouTubeVideo = ({ videoId }) => {
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <div className="youtube-video">
      <YouTube videoId={videoId} opts={opts} />;
    </div>
  );
};

export default YouTubeVideo;

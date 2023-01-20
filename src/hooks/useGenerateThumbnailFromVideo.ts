import { useState } from 'react';
import { toast } from 'react-toastify';

export interface IFileProcessing {
  fileName: string;
  thumbFile: any;
  originalFile: any;
}

const useGenerateThumbnailFromVideo = () => {
  const [processedFile, setProcessedFile] = useState<IFileProcessing | null>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startFileProcessing = async (videoFile: any) => {
    try {
      if (!videoFile?.name) throw new Error('Please select a valid video file.');

      setIsProcessing(true);

      let item: IFileProcessing = {
        fileName: videoFile?.name,
        thumbFile: null,
        originalFile: videoFile,
      };

      const thumbFile = await createVideoThumbnail(videoFile, 2.0);
      setProcessedFile({ ...item, thumbFile });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return [(videoFile: any) => startFileProcessing(videoFile), processedFile, isProcessing] as const;
};

const createVideoThumbnail = async (file: File, seekTo = 0.0, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const player = document.createElement('video');
    player.setAttribute('src', URL.createObjectURL(file));

    player.load();
    player.addEventListener('error', (err: any) => reject(`${file?.name} is invalid video format.`));

    // load metadata of the video to get video duration and dimensions
    player.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (player.duration < seekTo) {
        reject('The video is too short.');
        return;
      }

      // Delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        player.currentTime = seekTo;
      }, 500);

      // extract video thumbnail once seeking is complete
      player.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const videoCanvas = document.createElement('canvas');
        videoCanvas.width = player.videoWidth;
        videoCanvas.height = player.videoHeight;

        // draw the video frame to canvas
        const videoContext: any = videoCanvas.getContext('2d');
        videoContext.drawImage(player, 0, 0, videoCanvas.width, videoCanvas.height);

        // return the canvas image as a blob
        videoContext.canvas.toBlob((blob: any) => resolve(blob), 'image/jpeg', quality);
      });
    });
  });
};

export default useGenerateThumbnailFromVideo;

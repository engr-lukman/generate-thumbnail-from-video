import { useEffect, useState } from 'react';

import useGenerateThumbnailFromVideo, { IFileProcessing } from 'hooks/useGenerateThumbnailFromVideo';
import Spinner from 'components/Spinner';

const Feature = () => {
  const [file, setFile] = useState<IFileProcessing | null>(null);

  // File processing
  const [fileProcessingFn, processedFile, isProcessing] = useGenerateThumbnailFromVideo();
  useEffect(() => {
    if (!!processedFile?.thumbFile && !isProcessing) {
      setFile(processedFile);
    }
  }, [processedFile, isProcessing]);

  return (
    <div className="relative px-5 py-2">
      <div className="flex justify-center">
        <div className="w-[50vw] h-full">
          <h2 className="flex justify-between items-center font-semibold text-black mb-2">Select a video file</h2>
          <div className="flex w-full h-[75vh] justify-center items-start border border-dashed border-black text-white p-4">
            <div className="w-full">
              <input
                type="file"
                accept="video/*"
                onChange={(e: any) => fileProcessingFn(e.target.files[0])}
                className="text-black"
              />

              <div className="mt-4">
                {isProcessing && (
                  <div className="flex justify-start items-center space-x-2 text-black">
                    <Spinner className="w-6 h-6" /> <span>Processing...</span>
                  </div>
                )}

                {!!file && !isProcessing && (
                  <div className="flex justify-start items-start space-x-4">
                    <img src={URL.createObjectURL(file?.thumbFile)} alt="thumbnail" className="w-auto h-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;

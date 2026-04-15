import { Handle, Position } from "reactflow";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Video, Upload, Play } from "lucide-react";

export default function VideoNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const { nodeStates, runNode } = useStore();
  const isRunning = nodeStates[id]?.isRunning;
  const [uppy, setUppy] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { Uppy } = require('@uppy/core');
      const Dashboard = require('@uppy/dashboard');
      const Transloadit = require('@uppy/transloadit');
      const DragDrop = require('@uppy/drag-drop');

      const uppyInstance = new Uppy({
        autoProceed: true,
        restrictions: {
          allowedFileTypes: ['.mp4', '.mov', '.webm', '.avi'],
          maxNumberOfFiles: 1,
          maxFileSize: 100 * 1024 * 1024, // 100MB
        },
      })
      .use(Transloadit, {
        params: {
          auth: { key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY },
        },
        waitForEncoding: true,
        signature: process.env.NEXT_PUBLIC_TRANSLOADIT_SIGNATURE,
      })
      .use(DragDrop, { target: '#video-dropzone' })
      .use(Dashboard, {
        inline: true,
        target: '#video-dropzone',
        proudlyDisplayPoweredByUppy: false,
        showLinkToFileUploadResult: false,
        height: 200,
      });

      uppyInstance.on('transloadit:assembly-upload-complete', (result: any) => {
        const url = result.results['file-to-mp4'][0]?.ssl_url || result.results['file'][0]?.ssl_url;
        updateNodeData(id, { videoUrl: url });
      });

      setUppy(uppyInstance);

      return () => uppyInstance.close();
    }
  }, [id, updateNodeData]);

  return (
    <div className={`w-[300px] h-[240px] rounded-krea-lg border-2 border-slate-700/70 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-sm shadow-krea-glow-lg p-krea-4 transition-all duration-300 hover:shadow-krea-glow ${isRunning ? 'running' : ''}`}>
      <div className="flex items-center gap-krea-2 mb-krea-3">
        <Video className="h-4 w-4 text-krea-400 drop-shadow-sm" />
        <span className="font-semibold text-sm text-slate-200 tracking-tight">Upload Video</span>
      </div>
      <div id="video-dropzone" className="flex-1 rounded-krea border-2 border-dashed border-slate-600 hover:border-krea-400 transition-colors bg-slate-900/50 cursor-pointer group relative overflow-hidden">
        {data.videoUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-krea-3">
            <video src={data.videoUrl} controls className="w-32 h-24 object-cover rounded-krea shadow-krea-glow mb-krea-2 bg-black" />
            <div className="text-xs text-slate-300 truncate max-w-full px-1">
              {data.videoUrl}
            </div>
            <button onClick={() => updateNodeData(id, { videoUrl: undefined })} className="mt-krea-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">Replace</button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-slate-400 group-hover:text-krea-400 transition-colors mx-auto mb-krea-2" />
            <div className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors mb-krea-1">Drag video here or click to upload</div>
            <div className="text-xs text-slate-500">MP4, MOV, WebM up to 100MB</div>
          </>
        )}
      </div>
      <button
        onClick={() => runNode(id)}
        disabled={isRunning}
        className="mt-krea-2 w-full px-krea-3 py-krea-2 bg-gradient-to-r from-krea-600 to-krea-500 text-white rounded-krea font-semibold text-xs uppercase tracking-wider hover:from-krea-500 hover:to-krea-400 shadow-krea-glow transition-all duration-200 hover:shadow-krea-glow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {isRunning ? (
          <>
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            Run Node
          </>
        )}
      </button>
      <Handle type="target" position={Position.Left} id="input" className="opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} id="output" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}

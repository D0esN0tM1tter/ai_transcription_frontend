import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ArrowLeft, Play, Loader2, Subtitles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadProcessedVideo, fetchProcessedVideoBlob, getSubtitleTrackUrl } from "@/lib/api";

interface ProcessingResult {
  job_id?: string;
  target_languages?: string[];
  input_language?: string;
  processed_video_url?: string;
  targetLanguages?: string[];
  inputLanguage?: string;
  summary? : string ;
}

interface LocationState {
  result?: ProcessingResult;
  originalFile?: File;
  jobId?: string;
  processedVideoUrl?: string;
}

const App = () => {
  const location = useLocation();
  const { result, originalFile, jobId, processedVideoUrl } = (location.state as LocationState) || {};
  const [selectedLanguage, setSelectedLanguage] = useState("none"); // Default to 'none' for no subtitles
  const [isDownloading, setIsDownloading] = useState(false);
  const [processedVideoBlob, setProcessedVideoBlob] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [showProcessedVideo, setShowProcessedVideo] = useState(false);
  const [subtitleText, setSubtitleText] = useState<string>("");
  const [isLoadingSubtitle, setIsLoadingSubtitle] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const extractedResult = result || {};
  const targetLanguages = extractedResult.target_languages || extractedResult.targetLanguages || [];
  const inputLanguage = extractedResult.input_language || extractedResult.inputLanguage || "";
  const actualJobId = jobId || extractedResult.job_id || "";
  const videoSummary = extractedResult.summary || "Moroccan and French authorities conducted a joint anti-terrorism operation, arresting several suspects planning attacks in both countries. Among them, a Moroccan woman in France was detained for attempting to target a church. The operation, supported by French intelligence, underscores strong bilateral cooperation against terrorism."
  const languages = [
    { code: "english", name: "English" },
    { code: "arabic", name: "Arabic" },
    { code: "spanish", name: "Spanish" },
    { code: "french", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" }
  ];
  const getLanguageName = (code: string) => languages.find(lang => lang.code === code)?.name || code;

  const loadProcessedVideo = async () => {
    if (!actualJobId || processedVideoBlob) return;
    setIsLoadingVideo(true);
    setVideoError(null);
    try {
      const blob = await fetchProcessedVideoBlob(actualJobId);
      if (!blob.type.startsWith('video/')) {
        console.warn('Received blob type:', blob.type);
      }
      const videoUrl = URL.createObjectURL(blob);
      setProcessedVideoBlob(videoUrl);
      toast({
        title: "Processed Video Loaded",
        description: "You can now preview the video with subtitles.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setVideoError(errorMessage);
      toast({
        title: "Video Load Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleSubtitleChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    
    if (videoRef.current) {
      const video = videoRef.current;
      const tracks = video.textTracks;
      
      // Disable all tracks first
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = 'disabled';
      }
      
      // Enable selected track
      if (languageCode && languageCode !== 'none') {
        let trackFound = false;
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          // Match by language code (srcLang) or label
          if (track.language === languageCode || track.label === getLanguageName(languageCode)) {
            track.mode = 'showing';
            trackFound = true;
            break;
          }
        }
        
        if (!trackFound) {
          console.warn(`No matching subtitle track found for language: ${languageCode}`);
          toast({
            title: "Subtitle Track Not Found",
            description: `Could not find subtitle track for ${getLanguageName(languageCode)}. Ensure the backend provides the .vtt file for this language.`,
            variant: "destructive"
          });
        }
      }
    } else {
      console.warn('Video ref not available for subtitle track selection');
    }

    // Fetch and display VTT file content
    setSubtitleText("");
    if (languageCode && languageCode !== "none" && actualJobId) {
      setIsLoadingSubtitle(true);
      try {
        const vttUrl = getSubtitleTrackUrl(actualJobId, languageCode);
        const res = await fetch(vttUrl);
        if (!res.ok) throw new Error("Failed to fetch subtitle file");
        const vtt = await res.text();
        setSubtitleText(vtt);
      } catch (err) {
        setSubtitleText("Failed to load subtitle file.");
      } finally {
        setIsLoadingSubtitle(false);
      }
    } else {
      setSubtitleText("");
    }
  };

  useEffect(() => {
    // Only set a default if no language is currently selected (e.g., on initial load)
    if (Array.isArray(targetLanguages) && targetLanguages.length > 0 && selectedLanguage === "none") {
      const defaultLang = targetLanguages[0];
      setSelectedLanguage(defaultLang);
    }
  }, [targetLanguages, selectedLanguage]);

  useEffect(() => {
    if (showProcessedVideo && processedVideoBlob && videoRef.current) {
      // A small delay might be necessary to ensure all <track> elements are parsed by the browser
      const timer = setTimeout(() => {
        handleSubtitleChange(selectedLanguage);
      }, 200); // Give browser a moment to process tracks
      return () => clearTimeout(timer);
    }
  }, [processedVideoBlob, showProcessedVideo, selectedLanguage]); // Re-run when these change

  useEffect(() => {
    return () => {
      if (processedVideoBlob) {
        URL.revokeObjectURL(processedVideoBlob);
      }
    };
  }, [processedVideoBlob]);

  const handleDownload = async () => {
    if (!actualJobId) {
      toast({
        title: "Download Error",
        description: "Job ID not found. Cannot download video.",
        variant: "destructive"
      });
      return;
    }
    setIsDownloading(true);
    try {
      const response = await downloadProcessedVideo(actualJobId);
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'processed_video.mkv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) filename = filenameMatch[1].replace(/['"]/g, '');
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      toast({ title: "Download Complete", description: `${filename} has been downloaded successfully.` });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "There was an error downloading your video.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };


  if (!extractedResult && !actualJobId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">No Results Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              No processing results were found. Please upload and process a video first.
            </p>
            <Link to="/upload">
              <Button className="bg-gradient-primary hover:opacity-90">
                Upload Video
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/upload">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">Processing Complete!</h1>
            <p className="text-xl text-muted-foreground">
              Your video has been processed with subtitles in multiple languages
            </p>
            {actualJobId && (
              <p className="text-sm text-muted-foreground">
                Job ID: {actualJobId}
              </p>
            )}
          </div>

          {/* Video Summary Section */}
          <div className="mb-8">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Video Content Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-base text-muted-foreground whitespace-pre-line">
                  {videoSummary}
                </div>

                {/* Subtitle Content Section */}
                {showProcessedVideo && processedVideoBlob && (
                  <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Subtitle File Content ({getLanguageName(selectedLanguage)})</h4>
                    {isLoadingSubtitle ? (
                      <div className="text-muted-foreground text-sm">Loading subtitle file...</div>
                    ) : subtitleText ? (
                      <pre className="whitespace-pre-wrap text-xs bg-background p-2 rounded overflow-x-auto max-h-64">{subtitleText}</pre>
                    ) : (
                      <div className="text-muted-foreground text-sm">No subtitle file loaded.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Video Player */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    {showProcessedVideo ? "Processed Video with Subtitles" : "Original Video Preview"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={!showProcessedVideo ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowProcessedVideo(false);
                        setVideoError(null);
                      }}
                    >
                      Original
                    </Button>
                    <Button
                      variant={showProcessedVideo ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowProcessedVideo(true);
                        if (!processedVideoBlob && !isLoadingVideo) {
                          loadProcessedVideo();
                        }
                      }}
                      disabled={!actualJobId}
                    >
                      <Subtitles className="h-4 w-4 mr-1" />
                      With Subtitles
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {showProcessedVideo ? (
                    // Processed video with subtitles
                    videoError ? (
                      <div className="w-full h-full flex items-center justify-center text-destructive">
                        <div className="text-center p-4">
                          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                          <p className="font-medium mb-2">Failed to Load Video</p>
                          <p className="text-sm mb-4">{videoError}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setVideoError(null);
                              loadProcessedVideo();
                            }}
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    ) : isLoadingVideo ? (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                          <p>Loading processed video...</p>
                        </div>
                      </div>
                    ) : processedVideoBlob ? (
                      <video 
                        ref={videoRef}
                        src={processedVideoBlob}
                        controls 
                        className="w-full h-full object-contain"
                        onLoadedData={() => {
                          console.log('Video loaded, available text tracks:', videoRef.current?.textTracks.length);
                        }}
                        onLoadedMetadata={() => {
                          // Additional debugging for subtitle tracks
                          if (videoRef.current) {
                            const tracks = videoRef.current.textTracks;
                            console.log('Video metadata loaded, available tracks:', tracks.length);
                            for (let i = 0; i < tracks.length; i++) {
                              console.log(`Track ${i}:`, {
                                label: tracks[i].label,
                                language: tracks[i].language,
                                kind: tracks[i].kind
                              });
                            }
                          }
                        }}
                        onError={(e) => {
                          console.error('Video playback error:', e);
                          setVideoError('Video playback failed');
                        }}
                      >
                        {/* Track for original language (if applicable) */}
                        {inputLanguage && (
                          <track
                            key={`track-input-${inputLanguage}`}
                            kind="subtitles"
                            src={getSubtitleTrackUrl(actualJobId, inputLanguage)}
                            srcLang={inputLanguage}
                            label={`${getLanguageName(inputLanguage)} (Original)`}
                            default={selectedLanguage === inputLanguage} // Set default if this is the initial choice
                          />
                        )}

                        {/* Tracks for target languages */}
                        {Array.isArray(targetLanguages) && targetLanguages.map((langCode: string) => (
                          <track
                            key={`track-${langCode}`}
                            kind="subtitles"
                            src={getSubtitleTrackUrl(actualJobId, langCode)}
                            srcLang={langCode}
                            label={getLanguageName(langCode)}
                            default={selectedLanguage === langCode} // Set default if this is the initial choice
                          />
                        ))}
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="mb-2">Processed video not loaded</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={loadProcessedVideo}
                            disabled={!actualJobId}
                          >
                            Load Video
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    // Original video
                    originalFile ? (
                      <video 
                        src={URL.createObjectURL(originalFile)}
                        controls 
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Original video preview not available</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                {/* Subtitle Controls */}
                {showProcessedVideo && processedVideoBlob && (
                  <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Active Subtitle Track:</label>
                        <Select value={selectedLanguage} onValueChange={handleSubtitleChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select subtitle language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Subtitles</SelectItem>
                            {inputLanguage && (
                              <SelectItem value={inputLanguage}>
                                {getLanguageName(inputLanguage)} (Original)
                              </SelectItem>
                            )}
                            {Array.isArray(targetLanguages) && targetLanguages.map((langCode: string) => (
                              <SelectItem key={langCode} value={langCode}>
                                {getLanguageName(langCode)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground mt-2">
                  {showProcessedVideo 
                    ? "This is your processed video with external VTT subtitles. Use the controls above to switch between subtitle languages."
                    : "This shows your original uploaded video. Switch to 'With Subtitles' to see the processed version."
                  }
                </p>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Subtitle Languages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {Array.isArray(targetLanguages) && targetLanguages.length > 0 ? (
                    <>
                      {inputLanguage && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Input Language:</p>
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {getLanguageName(inputLanguage)}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Generated Subtitle Languages:</p>
                        <div className="flex flex-wrap gap-2">
                          {targetLanguages.map((langCode: string) => (
                            <span 
                              key={langCode}
                              className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                            >
                              {getLanguageName(langCode)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• Switch to "With Subtitles" view to preview</p>
                          <p>• Subtitle tracks are now loaded via external VTT files</p>
                          <p>• Use the subtitle selector to switch languages</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">No target languages detected</p>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Possible causes:</p>
                        <p>• Backend response format mismatch</p>
                        <p>• Processing not completed successfully</p>
                        <p>• Navigation state data loss</p>
                      </div>
                      {actualJobId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.reload()}
                        >
                          Refresh Page
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Download Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleDownload}
                    disabled={!actualJobId || isDownloading}
                    className="w-full bg-gradient-primary hover:opacity-90"
                    size="lg"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download Video with Subtitles
                      </>
                    )}
                  </Button>
                 

                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Video with embedded subtitles (MKV format)</p>
                      <p>• Multiple language support via external VTT files</p>
                      <p>• High quality preservation</p>
                  
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">Process Another Video?</h3>
                    <Link to="/upload">
                      <Button variant="outline" className="w-full">
                        Upload New Video
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

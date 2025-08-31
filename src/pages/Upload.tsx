import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, X, Loader2, FileVideo, Languages, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processVideo } from "@/lib/api";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [inputLanguage, setInputLanguage] = useState("");
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [asrModelSize, setAsrModelSize] = useState("small");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const languages = [
    { code: "english", name: "English" },
    { code: "arabic", name: "Arabic" }, 
    { code: "spanish", name: "Spanish" },
    { code: "french", name: "French" },
  ];

  const modelSizes = [
    { 
      code: "tiny", 
      name: "Tiny", 
      description: "Fastest processing, basic accuracy"
    },
    { 
      code: "base", 
      name: "Base", 
      description: "Good balance of speed and accuracy"
    },
    { 
      code: "small", 
      name: "Small", 
      description: "Better accuracy, moderate speed"
    },
    { 
      code: "medium", 
      name: "Medium", 
      description: "High accuracy, slower processing"
    },
    { 
      code: "large", 
      name: "Large", 
      description: "Highest accuracy, slowest processing"
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleTargetLanguageSelect = (languageCode: string) => {
    if (!targetLanguages.includes(languageCode) && languageCode !== inputLanguage) {
      setTargetLanguages([...targetLanguages, languageCode]);
    }
  };

  const removeTargetLanguage = (languageCode: string) => {
    setTargetLanguages(targetLanguages.filter(lang => lang !== languageCode));
  };

  const handleSubmit = async () => {
    if (!file || !inputLanguage || targetLanguages.length === 0 || !asrModelSize) {
      toast({
        title: "Missing Information",
        description: "Please upload a video, select input language, choose target languages, and select a model size.",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      const result = await processVideo({ file, inputLanguage, targetLanguages, asrModelSize });
      toast({
        title: "Processing Complete",
        description: "Your video has been processed successfully!",
      });
      navigate("/result", { 
        state: { 
          result, 
          originalFile: file,
          jobId: result.job_id,
          processedVideoUrl: result.processed_video_url
        } 
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "There was an error processing your video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { icon: FileVideo, title: "Upload", active: !!file, gradient: "from-blue-500 to-cyan-500" },
    { icon: Languages, title: "Languages", active: inputLanguage && targetLanguages.length > 0, gradient: "from-purple-500 to-pink-500" },
    { icon: Download, title: "Process", active: asrModelSize !== "", gradient: "from-emerald-500 to-teal-500" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-32 left-10 w-80 h-80 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-15 blur-3xl"></div>
      
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6 mb-16">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Upload Your Video
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your video content with AI-powered subtitle generation in multiple languages
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    step.active 
                      ? `bg-gradient-to-r ${step.gradient} border-transparent text-white shadow-lg` 
                      : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    <step.icon className="h-5 w-5" />
                    {step.active && (
                      <div className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} rounded-full opacity-30 animate-pulse`}></div>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${step.active ? 'bg-gray-300' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <FileVideo className="mr-3 h-6 w-6 text-blue-600" />
                Video Upload & Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 p-8">
              {/* File Upload */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900">Video File</Label>
                {!file ? (
                  <div className="group border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <UploadIcon className="h-10 w-10 text-white" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-xl font-semibold text-gray-900">Drop your video here</p>
                        <p className="text-muted-foreground">or click to browse files</p>
                        <p className="text-sm text-muted-foreground bg-gray-100 px-4 py-2 rounded-full inline-block">
                          Supported formats: MP4, AVI, MOV, MKV
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <FileVideo className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
                          <p className="text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • Video File
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Input Language */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <Languages className="mr-2 h-5 w-5 text-blue-600" />
                  Input Language
                </Label>
                <Select value={inputLanguage} onValueChange={setInputLanguage}>
                  <SelectTrigger className="h-12 text-base border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select the language of your video" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-base py-3">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Languages */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <Languages className="mr-2 h-5 w-5 text-purple-600" />
                  Target Languages
                </Label>
                <Select onValueChange={handleTargetLanguageSelect}>
                  <SelectTrigger className="h-12 text-base border-2 hover:border-purple-300 transition-colors">
                    <SelectValue placeholder="Select languages for subtitle generation" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages
                      .filter(lang => lang.code !== inputLanguage && !targetLanguages.includes(lang.code))
                      .map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} className="text-base py-3">
                          {lang.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {targetLanguages.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-3">Selected Target Languages:</p>
                    <div className="flex flex-wrap gap-3">
                      {targetLanguages.map((langCode) => {
                        const lang = languages.find(l => l.code === langCode);
                        return (
                          <Badge key={langCode} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2">
                            {lang?.name}
                            <X 
                              className="h-4 w-4 cursor-pointer hover:scale-110 transition-transform" 
                              onClick={() => removeTargetLanguage(langCode)}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Model Size Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="mr-2 h-5 w-5 text-emerald-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  ASR Model Size
                </Label>
                <Select value={asrModelSize} onValueChange={setAsrModelSize}>
                  <SelectTrigger className="h-12 text-base border-2 hover:border-emerald-300 transition-colors">
                    <SelectValue placeholder="Select model size for transcription accuracy" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelSizes.map((model) => (
                      <SelectItem key={model.code} value={model.code} className="text-base py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">{model.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-emerald-800 mb-1">
                        Selected: {modelSizes.find(m => m.code === asrModelSize)?.name} Model
                      </p>
                      <p className="text-xs text-emerald-700">
                        {modelSizes.find(m => m.code === asrModelSize)?.description}
                      </p>
                      <div className="mt-2 text-xs text-emerald-600">
                        <p><strong>Tip:</strong> For most content, Small model provides the best balance. Use Large for professional content requiring highest accuracy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!file || !inputLanguage || targetLanguages.length === 0 || !asrModelSize || isProcessing}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:transform-none disabled:shadow-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Processing Your Video...
                    </>
                  ) : (
                    <>
                      <Download className="mr-3 h-5 w-5" />
                      Generate Subtitles
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Info */}
          <div className="text-center mt-12">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-2">
                 Your videos are processed securely within <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">SNRT</span>'s infrastructure
              </p>
              <p className="text-xs text-muted-foreground">
                Processing time varies based on video length and selected languages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
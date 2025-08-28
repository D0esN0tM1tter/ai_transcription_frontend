import { Upload, Languages, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Video",
      description: "Simply drag and drop your video file or browse to upload. The system supports all major video formats.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Languages,
      title: "Choose Languages",
      description: "Select your video's language and the target languages for subtitle generation.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Download,
      title: "Download Results",
      description: "Get your video with embedded subtitles in minutes. Switch between languages seamlessly.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-secondary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your video content with professional subtitles in just three simple steps. 
            Our AI-powered system handles the complexity while you focus on creating great content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="relative border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white/80 backdrop-blur-sm hover:-translate-y-2 overflow-hidden">
                {/* Card gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardContent className="p-8 text-center space-y-6 relative z-10">
                  <div className="relative">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    
                    {/* Icon container */}
                    <div className="relative mx-auto mb-2">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      
                      {/* Connecting line */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent">
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-gray-700 transition-colors">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-16">
          <p className="text-sm text-muted-foreground">
            Ready to get started? Upload your first video and experience the power of AI-driven subtitles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
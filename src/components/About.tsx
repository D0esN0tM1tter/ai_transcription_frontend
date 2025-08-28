import { Card, CardContent } from "@/components/ui/card";
import { Globe, Zap, Shield , BrainCircuit, User} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: "Intelligent System",
      description: "Powered by the latest Transformer-based architectures, SNRT Whisperer ensures reliable and high-quality transcriptions, even in challenging audio conditions.",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50"
    },
    {
      icon: User,
      title: "User-Friendly Interface",
      description: "Designed for ease of use by non-technical staff, with a simple interface for uploading, managing, and reviewing transcriptions.",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Fully deployed within SNRT's local network infrastructure, guaranteeing data confidentiality and compliance with internal policies.",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50"
    }
  ];

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-32 right-20 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-25 blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Revolutionizing Video Transcription For <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SNRT</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                SNRT Whisperer was developed to streamline and automate the transcription of SNRT's audiovisual content.
                Leveraging cutting-edge AI in automatic speech recognition (ASR) and neural machine translation, the system delivers highly accurate, multilingual transcriptions — all within a user-friendly interface accessible to both technical and editorial teams.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                The project was designed and developed by{" "}
              <a 
                href="www.linkedin.com/in/lahfari-bilal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-blue-700 underline hover:text-blue-900"
              >
                Bilal Lahfari
              </a>
              , software engineering and AI student, as part of an applied AI internship at SNRT.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  What Makes SNRT Whisperer Powerful?
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                <p className="text-muted-foreground leading-relaxed">
                  At its core, SNRT Whisperer integrates <span className="font-semibold text-gray-700">OpenAI's Whisper</span> — a state-of-the-art ASR model trained on <span className="font-semibold text-blue-600">680,000 hours</span> of multilingual audio — ensuring exceptional accuracy across diverse languages and dialects.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:pl-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:-translate-y-1 overflow-hidden">
                {/* Card gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardContent className="p-8 flex items-start space-x-6 relative z-10">
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    {/* Decorative ring */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10`}></div>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
                
                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </Card>
            ))}
            
            {/* Side accent */}
            <div className="hidden lg:block absolute top-1/2 -right-8 w-1 h-32 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full transform -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
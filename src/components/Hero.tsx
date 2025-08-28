import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import heroImage from "@/assets/SNRT Whisperer.png";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SNRT</span>'s AI Powered Subtitle Generation System.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                SNRT Whisperer simplifies and accelerates internal video transcription processes.
                By automating subtitle generation in multiple languages, the system reduces manual workload, supports editorial efficiency, and delivers production-ready transcriptions — all within SNRT's secure infrastructure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-all duration-300 group">
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Fast processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Multiple languages</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>High accuracy</span>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-50 blur-sm"></div>
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              <img 
                src={heroImage} 
                alt="Video subtitle generation interface" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-15 blur-2xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
import { Home, Building, MapPin, Key, Heart } from "lucide-react";

export function RealEstateLoader() {
  const styles = `
    @keyframes smoothBounce {
      0%,
      100% {
        transform: translateY(0px);
        opacity: 0.8;
      }
      50% {
        transform: translateY(-12px);
        opacity: 1;
      }
    }
    
    @keyframes smoothSpin {
      0% {
        transform: rotate(0deg) scale(1);
        opacity: 0.7;
      }
      50% {
        transform: rotate(180deg) scale(1.1);
        opacity: 1;
      }
      100% {
        transform: rotate(360deg) scale(1);
        opacity: 0.7;
      }
    }
    
    @keyframes smoothPulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 0.6;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
    }
    
    @keyframes smoothFloat {
      0%,
      100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.7;
      }
      33% {
        transform: translateY(-6px) rotate(2deg);
        opacity: 1;
      }
      66% {
        transform: translateY(3px) rotate(-1deg);
        opacity: 0.9;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="flex items-center justify-center min-h-screen transition-colors">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="flex items-center justify-center space-x-4">
              <Home
                className="w-16 h-16 text-gray-600 dark:text-gray-400"
                style={{
                  animation: "smoothBounce 2s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              />
              <Building
                className="w-14 h-14 text-gray-700 dark:text-gray-300"
                style={{
                  animation: "smoothBounce 2s ease-in-out infinite",
                  animationDelay: "0.3s",
                }}
              />
              <Home
                className="w-12 h-12 text-gray-500 dark:text-gray-500"
                style={{
                  animation: "smoothBounce 2s ease-in-out infinite",
                  animationDelay: "0.6s",
                }}
              />
            </div>

            {/* Floating icons */}
            <div className="absolute -top-4 -left-4">
              <Key
                className="w-6 h-6 text-gray-500 dark:text-gray-400"
                style={{
                  animation: "smoothSpin 4s ease-in-out infinite",
                  animationDelay: "0.2s",
                }}
              />
            </div>
            <div className="absolute -top-6 -right-2">
              <Heart
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                style={{
                  animation: "smoothPulse 2.5s ease-in-out infinite",
                  animationDelay: "0.4s",
                }}
              />
            </div>
            <div className="absolute -bottom-6 left-8">
              <MapPin
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                style={{
                  animation: "smoothFloat 3s ease-in-out infinite",
                  animationDelay: "0.8s",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

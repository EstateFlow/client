import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import house1 from "@/assets/images/mainhouse_1.jpg";
import house2 from "@/assets/images/mainhouse_2.jpg";
import house3 from "@/assets/images/mainhouse_3.jpg";

export default function MainPage() {
  const handleExternalDownload = () => {
    window.open(
      "https://github.com/EstateFlow/mobile/blob/main/App/EstateFlow.apk",
      "_blank",
    );
  };

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      <section className="text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-10 tracking-tight text-gray-900 drop-shadow-sm dark:text-white dark:drop-shadow-md transition-colors duration-300">
          Find Your Flow with EstateFlow
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {[house1, house2, house3].map((src, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={src}
                alt={`House ${index + 1}`}
                className="w-full h-[250px] object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="text-lg text-gray-700 dark:text-white space-y-6 max-w-7xl ml-4 text-left leading-relaxed tracking-wide">
          <p>
            Every space we live in affects our mood, rhythm, and sense of self.
            That's why it's important to find not just square meters — but a
            place where you're truly comfortable.
          </p>
          <p>We create conditions where it's easy to feel: this is yours.</p>
          <p>
            Whether you're looking for a place to rent or planning to buy — we
            make sure that everything is simple, honest, and clear. Our
            principle is to choose the best properties, take care of service,
            support, and the level of quality that you want to recommend to your
            friends.
          </p>
          <p>
            And we're open to everyone — and your pets are welcome here too :)
            Choose a home that truly suits your lifestyle — and live in it with
            pleasure.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <Link to="/listings" className="[&.active]:underline">
            <Button className="text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-md hover:shadow-lg transition-all ease-in-out duration-300 cursor-pointer">
              To listings <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-whit shadow-sm hover:shadow-md transition-all ease-in-out duration-300 cursor-pointer"
            onClick={handleExternalDownload}
          >
            <Download className="mr-2 w-4 h-4" /> Download app
          </Button>
        </div>
      </section>
    </main>
  );
}

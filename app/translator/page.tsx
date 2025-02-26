"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ASLTranslator } from "@/components/asl-translator";
import SupportedGestures from "@/components/supported-gestures";

export default function TranslatorPage() {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [translationHistory, setTranslationHistory] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<string[]>([]);
  const [sentence, setSentence] = useState<string[]>([]);
  const sessionRef = useRef<string[]>([]);

  const handleTranslation = (text: string) => {
    setTranslatedText(text);
    setSentence((prev) => [...prev, text]);

    // Add text or sentances to current session instead of directly to history
    sessionRef.current = [...sessionRef.current, text];
    setCurrentSession(sessionRef.current);
  };

  const toggleWebcam = () => {
    if (isWebcamActive) {
      // When disabling webcam, save the current session to history
      if (sessionRef.current.length > 0) {
        const sessionText = sessionRef.current.join(" ");
        setTranslationHistory((prev) => [sessionText, ...prev].slice(0, 10));
      }
    } else {
      // When enabling webcam, start a new session
      sessionRef.current = [];
      setCurrentSession([]);
    }

    setIsWebcamActive(!isWebcamActive);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const clearHistory = () => {
    setTranslationHistory([]);
    setTranslatedText("");
    setSentence([]);
    sessionRef.current = [];
    setCurrentSession([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sentence.length > 0) {
        // Update the current session with the sentence
        setSentence([]);
      }
    }, 16000);

    return () => clearTimeout(timer);
  }, [sentence]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold">ASL Translator</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>
      <main className="container flex-1 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Tabs defaultValue="text" className="lg:col-span-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="live_translation">
                Live Translation
              </TabsTrigger>
              <TabsTrigger value="supported_gestures">
                Supported Gestures
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live_translation" className="lg:col-span-2">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {isWebcamActive ? (
                      <ASLTranslator onTranslation={handleTranslation} />
                    ) : (
                      <div className="flex items-center justify-center bg-muted aspect-video">
                        <Button
                          onClick={toggleWebcam}
                          className="p-2 text-white bg-blue-300"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Enable Webcam
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <Button
                      variant={isWebcamActive ? "destructive" : "default"}
                      onClick={toggleWebcam}
                      className="p-2 text-white bg-blue-300"
                    >
                      {isWebcamActive ? (
                        <>
                          <CameraOff className="w-4 h-4 mr-2" />
                          Disable Webcam
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Enable Webcam
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={toggleMute}
                      className="p-2"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2" />
                          Unmute
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Mute
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={clearHistory}
                    className="p-2 bg-red-300"
                  >
                    Clear History
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="supported_gestures">
              <SupportedGestures />
            </TabsContent>
          </Tabs>
          <div>
            <Tabs defaultValue="current">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="current" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="min-h-[200px]">
                      <h3 className="mb-2 text-lg font-medium">
                        Translated Text
                      </h3>
                      <div className="text-3xl font-bold">
                        {translatedText || "No translation yet"}
                      </div>
                      <div className="mt-4 text-lg">{sentence.join(" ")}</div>

                      {currentSession.length > 0 && (
                        <div className="p-3 mt-4 rounded-md bg-muted/50">
                          <h4 className="mb-1 text-sm font-medium">
                            Current Session
                          </h4>
                          <p>{currentSession.join(" ")}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="min-h-[200px]">
                      <h3 className="mb-2 text-lg font-medium">
                        Translation History
                      </h3>
                      {translationHistory.length > 0 ? (
                        <ul className="space-y-2">
                          {translationHistory.map((text, index) => (
                            <li key={index} className="p-2 rounded-md bg-muted">
                              {text}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          No translation history
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

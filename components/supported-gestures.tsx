import React from "react";
import { Card } from "./ui/card";
import { ASLGestures } from "@/data/handgesture-data";

const SupportedGestures = () => {
  return (
    <>
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Supported Sign Language Gestures
        </h2>
        <p className="mb-6 text-muted-foreground">
          This application can recognize the following sign language gestures.
          Due to technical limitations, we currently support a subset of these
          gestures reliably.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Basic Gestures</h3>
            <ul className="pl-5 space-y-1 list-disc">
              {ASLGestures.filter((g) => g.category === "Basic").map(
                (gesture) => (
                  <li key={gesture.name} className="text-sm">
                    <span className="font-medium">{gesture.name}</span>:{" "}
                    {gesture.description}
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Alphabets </h3>
            <ul className="pl-5 space-y-1 list-disc">
              {ASLGestures.filter((g) => g.category === "Alphabet")
                .slice(0, 15)
                .map((gesture) => (
                  <li key={gesture.name} className="text-sm">
                    <span className="font-medium">{gesture.name}</span>:{" "}
                    {gesture.description}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="p-4 mt-6 rounded-lg bg-muted">
          <h4 className="mb-2 font-semibold">Currently Reliable Gestures</h4>
          <p className="text-sm text-muted-foreground">
            The most reliable gestures in the current implementation are:
          </p>
        </div>
      </Card>
    </>
  );
};

export default SupportedGestures;

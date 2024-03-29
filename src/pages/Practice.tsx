import { For, JSXElement, Show, onCleanup, onMount } from "solid-js";

import { useService } from "@/service";

import Button from "../components/Button";
import PracticeLine from "../components/PracticeLine";

export default function Practice(): JSXElement {
  let service = useService();

  let onKeyEvent = (e: KeyboardEvent) => {
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        service.selectPreviousLine();
        break;
      case "ArrowRight":
      case "KeyD":
        service.selectNextLine();
        break;
      case "Escape":
        service.unselectLine();
        break;
      case "KeyQ":
      case "Enter":
        if (service.store.isRecording) {
          service.stopRecord();
        } else {
          service.recordSelectLine();
        }
        break;
      case "KeyW":
      case "ArrowUp":
        service.playSelectLine();
        break;
      case "ArrowDown":
      case "KeyS":
        service.playSelectLineRecord();
        break;
    }

    return false;
  };

  onMount(() => {
    document.addEventListener("keydown", onKeyEvent);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyEvent);
  });

  return (
    <>
      <div class="my-2">
        <button
          type="button"
          class="p-1 underline"
          onClick={() => {
            service.navToStart();
          }}
        >
          back
        </button>
      </div>
      <div>
        <video
          class="w-full"
          ref={(ref) => service.setMediaRef(ref)}
          src={service.store.sourceUrl}
          controls
          autoplay={false}
        />
      </div>

      <div class="py-4">
        options:
        <span class="mx-2">
          play while recording{" "}
          <input
            type="checkbox"
            onClick={() => {
              service.updateOption(
                "playLineWhileRecording",
                !service.store.options.playLineWhileRecording
              );
            }}
            checked={service.store.options.playLineWhileRecording}
          />
        </span>
        <span class="mx-2">
          auto stop recoding{" "}
          <input
            type="checkbox"
            onClick={() => {
              service.updateOption(
                "autoStopRecording",
                !service.store.options.autoStopRecording
              );
            }}
            checked={service.store.options.autoStopRecording}
          />
        </span>
        <span class="mx-2">
          auto play{" "}
          <input
            type="checkbox"
            onClick={() => {
              service.updateOption(
                "autoPlay",
                !service.store.options.autoPlay
              );
            }}
            checked={service.store.options.autoPlay}
          />
        </span>
        <span>
          , rate:{" "}
          <select
            class="border border-gray-500"
            value={service.store.options.playbackRate}
            onChange={(e) => {
              service.updatePlaybackRate(JSON.parse(e.target.value));
            }}
          >
            <option value="0.5">0.5</option>
            <option value="0.75">0.75</option>
            <option value="1">1</option>
            <option value="1.25">1.25</option>
            <option value="1.5">1.5</option>
          </select>
        </span>
        <Button class="mx-2" onClick={() => service.exportRecord()}>
          save records
        </Button>
      </div>
      <div class="py-4">
        <Show when={service.store.currentLineIndex == null}>
          <For each={service.store.lines}>
            {(line) => (
              <div
                class="py-1 hover:bg-blue-100 cursor-pointer"
                onClick={() => service.selectLine(line.index)}
              >
                {line.index + 1}. {line.text}
              </div>
            )}
          </For>
        </Show>
        <Show when={service.store.currentLineIndex != null}>
          <div>
            <div class="text-right">
              <button
                type="button"
                title="end practice (Esc)"
                class="underline hover:text-gray-500"
                onClick={() => service.unselectLine()}
              >
                close
              </button>
            </div>
            <PracticeLine />
          </div>
        </Show>
      </div>
    </>
  );
}

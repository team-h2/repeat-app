import { JSXElement, onMount, ParentProps } from "solid-js";
import { Toaster } from "solid-toast";

import Header from "@/components/Header";
import { useService } from "@/service";
import { useNavigate } from "@solidjs/router";

export default function Root(props: ParentProps): JSXElement {
  let service = useService();
  service.init(useNavigate());

  onMount(() => {
    // check the quest string
    let query = new URLSearchParams(location.search);

    if (query.has("sourceUrl") && query.has("subtitleUrl")) {
      service.startPractice(
        query.get("type") == "video",
        query.get("sourceUrl"),
        query.get("subtitleUrl")
      );
    }
  });

  return (
    <>
      <Header />
      {props.children}
      <Toaster />
    </>
  );
}
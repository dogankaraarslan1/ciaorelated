import { apollo } from "../apollo";
import { UPLOAD_QUEUE } from "../graphql/queries/uploadQueue";

export type UploadQueueItem = {
  __typename?: "UploadQueueItem";
  id: string;
  text: string;
  previewUri?: string | null;
  createdAt: string;
};

export function pushUploadQueue(item: UploadQueueItem) {
  try {
    const existing = apollo.readQuery({ query: UPLOAD_QUEUE }) as any;
    const list: UploadQueueItem[] = existing?.uploadQueue ?? [];
    apollo.writeQuery({
      query: UPLOAD_QUEUE,
      data: { uploadQueue: [item, ...list] },
    });
  } catch {
    // falls noch nicht initialisiert
    apollo.writeQuery({
      query: UPLOAD_QUEUE,
      data: { uploadQueue: [item] },
    });
  }
}

export function removeUploadQueue(id: string) {
  try {
    const existing = apollo.readQuery({ query: UPLOAD_QUEUE }) as any;
    const list: UploadQueueItem[] = existing?.uploadQueue ?? [];
    apollo.writeQuery({
      query: UPLOAD_QUEUE,
      data: { uploadQueue: list.filter((x) => x.id !== id) },
    });
  } catch {}
}

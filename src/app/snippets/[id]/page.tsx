import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";

// interface SnippetShowPageProps {
//   params: {
//     id: string;
//   };
// }

// We also need to update the interface and wrap the params in a Promise:
interface SnippetShowPageProps {
  params: Promise<{ id: string }>;
}

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  // const snippet = await db.snippet.findFirst({
  //   where: { id: parseInt(props.params.id) },
  // });

  // In NextJS 15 we must await params or searchParams before accessing
  const { id } = await props.params;

  const snippet = await db.snippet.findFirst({
    where: { id: parseInt(id) },
  });

  if (!snippet) {
    return notFound();
  }

  return (
    <div>
      <div className="flex m-4 justify-between items-center">
        <h1 className="text-xl font-bold">{snippet.title}</h1>
        <div className="flex gap-4">
          <Link
            href={`/snippets/${snippet.id}/edit`}
            className="p-2 border rounded"
          >
            Edit
          </Link>
          <button className="p-2 border rounded">Delete</button>
        </div>
      </div>
      <pre className="p-3 border rounded bg-gray-200 border-gray-200">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

export async function generateStaticParams() {
  const snippets = await db.snippet.findMany();

  return snippets.map((snippet) => {
    return {
      id: snippet.id.toString(),
    };
  });
}

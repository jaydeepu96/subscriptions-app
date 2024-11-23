// In your events.jsx file
import { redirect } from "@remix-run/node"; // To redirect after form submission
import { prisma } from "../db.server"; // Prisma client (assuming you have it set up
export async function loader() {
  // Fetch events data from the database
  const events = await prisma.event.findMany();
  return { events };
}

export async function action({ request }) {
  const formData = new URLSearchParams(await request.text());
  const title = formData.get("title");
  const description = formData.get("description");

  // Use Prisma to save data to the database
  await prisma.event.create({
    data: {
      title,
      description,
    },
  });

  return redirect("/events"); // Redirect to events page after submission
}

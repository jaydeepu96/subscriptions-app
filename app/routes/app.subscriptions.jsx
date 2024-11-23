import { useState } from "react";
import {
  Form,
  useLoaderData,
  useActionData,
  useFetcher,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import "../styles/subscriptions.css";

// Loader to fetch existing subscriptions
export const loader = async () => {
  const subscriptions = await prisma.subscription.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      durationFrom: true,
      durationTo: true,
      subscriptionCycle: true,
      pricing: true,
      customerId: true,
    },
  });
  return json({ subscriptions });
};

// Action to handle form submission for creating, editing, or deleting subscriptions
export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  // Create Subscription
  if (actionType === "create") {
    const title = formData.get("title");
    const status = formData.get("status");
    const durationFrom = new Date(formData.get("durationFrom"));
    const durationTo = new Date(formData.get("durationTo"));
    const subscriptionCycle = formData.get("subscriptionCycle");
    const pricing = parseFloat(formData.get("pricing"));
    const customerId = formData.get("customerId");
    const autoRenewal = formData.get("autoRenewal") === "true";
    const trialPeriodDays = parseInt(formData.get("trialPeriodDays"));
    const trialPeriodWeeks = parseInt(formData.get("trialPeriodWeeks"));
    const startDate = new Date(formData.get("startDate"));

    try {
      const subscription = await prisma.subscription.create({
        data: {
          title,
          status,
          durationFrom,
          durationTo,
          subscriptionCycle,
          pricing,
          customerId,
          autoRenewal,
          trialPeriodDays,
          trialPeriodWeeks,
          startDate,
        },
      });
      return json({ success: true, subscription });
    } catch (error) {
      console.error("Error creating subscription:", error);
      return json({ success: false, error: "Failed to create subscription" });
    }
  }

  // Edit Subscription
  if (actionType === "edit") {
    const id = formData.get("id");
    const updates = {
      title: formData.get("title"),
      status: formData.get("status"),
      durationFrom: new Date(formData.get("durationFrom")),
      durationTo: new Date(formData.get("durationTo")),
      subscriptionCycle: formData.get("subscriptionCycle"),
      pricing: parseFloat(formData.get("pricing")),
      customerId: formData.get("customerId"),
    };
    await prisma.subscription.update({ where: { id }, data: updates });
    return json({ success: true });
  }

  // Delete Subscription
  if (actionType === "delete") {
    const id = formData.get("id");
    await prisma.subscription.delete({ where: { id } });
    return json({ success: true });
  }
};

export default function SubscriptionPage() {
  const { subscriptions } = useLoaderData();
  const actionData = useActionData();
  const fetcher = useFetcher();
  const [editData, setEditData] = useState(null);

  const handleEditClick = (subscription) => {
    setEditData(subscription);
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  return (
    <div>
      <h1>Manage Subscriptions</h1>

      {/* Subscription Creation Form */}
      <div className="form-container">
        <h2>Create a Subscription</h2>
        {actionData?.success && <p>Subscription created successfully!</p>}
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}

        <Form method="post">
          <input type="hidden" name="_action" value="create" />

          <label>
            Title:
            <input type="text" name="title" required />
          </label>

          <label>
            Status:
            <select name="status">
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Canceled">Canceled</option>
            </select>
          </label>

          <label>
            Duration From:
            <input type="date" name="durationFrom" required />
          </label>

          <label>
            Duration To:
            <input type="date" name="durationTo" required />
          </label>

          <label>
            Subscription Cycle:
            <select name="subscriptionCycle">
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </label>

          <label>
            Pricing:
            <input type="number" name="pricing" step="0.01" required />
          </label>

          <label>
            Customer ID:
            <input type="text" name="customerId" required />
          </label>

          <label>
            Auto-Renewal:
            <input type="checkbox" name="autoRenewal" />
          </label>

          <label>
            Trial Period (Days):
            <input type="number" name="trialPeriodDays" />
          </label>

          <label>
            Trial Period (Weeks):
            <input type="number" name="trialPeriodWeeks" />
          </label>

          <label>
            Start Date:
            <input type="date" name="startDate" required />
          </label>

          <button type="submit">Create Subscription</button>
        </Form>
      </div>

      {/* Subscription List */}
      <h2>Existing Subscriptions</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Customer ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td>{subscription.title}</td>
              <td>{subscription.status}</td>
              <td>{subscription.customerId}</td>
              <td>
                <button onClick={() => handleEditClick(subscription)}>
                  Edit
                </button>
                <fetcher.Form method="post">
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="id" value={subscription.id} />
                  <button type="submit">Delete</button>
                </fetcher.Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editData && (
        <div className="edit-form">
          <h2>Edit Subscription</h2>
          <Form method="post">
            <input type="hidden" name="_action" value="edit" />
            <input type="hidden" name="id" value={editData.id} />

            <label>
              Title:
              <input
                type="text"
                name="title"
                defaultValue={editData.title}
                required
              />
            </label>

            <label>
              Status:
              <select name="status" defaultValue={editData.status} required>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Canceled">Canceled</option>
              </select>
            </label>

            <label>
              Duration From:
              <input
                type="date"
                name="durationFrom"
                defaultValue={editData.durationFrom}
                required
              />
            </label>

            <label>
              Duration To:
              <input
                type="date"
                name="durationTo"
                defaultValue={editData.durationTo}
                required
              />
            </label>

            <label>
              Subscription Cycle:
              <select
                name="subscriptionCycle"
                defaultValue={editData.subscriptionCycle}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </label>

            <label>
              Pricing:
              <input
                type="number"
                name="pricing"
                defaultValue={editData.pricing}
                step="0.01"
                required
              />
            </label>

            <label>
              Customer ID:
              <input
                type="text"
                name="customerId"
                defaultValue={editData.customerId}
                required
              />
            </label>

            <button type="submit">Save Changes</button>
            <button type="button" className="cancel" onClick={handleCancelEdit}>
              Cancel
            </button>
          </Form>
        </div>
      )}
    </div>
  );
}

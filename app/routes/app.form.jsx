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
      autoRenewal: true,
      trialPeriodDays: true,
      trialPeriodWeeks: true,
      startDate: true,
    },
  });
  return json({ subscriptions });
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "create" || actionType === "edit") {
    try {
      const data = {
        title: formData.get("title"),
        status: formData.get("status"),
        durationFrom: new Date(formData.get("durationFrom")),
        durationTo: new Date(formData.get("durationTo")),
        subscriptionCycle: formData.get("subscriptionCycle"),
        pricing: parseFloat(formData.get("pricing")),
        customerId: formData.get("customerId"),
        autoRenewal: formData.get("autoRenewal") === "true",
        trialPeriodDays: parseInt(formData.get("trialPeriodDays")),
        trialPeriodWeeks: parseInt(formData.get("trialPeriodWeeks")),
        startDate: new Date(formData.get("startDate")),
      };

      if (actionType === "create") {
        await prisma.subscription.create({ data });
      } else if (actionType === "edit") {
        const id = formData.get("id");
        await prisma.subscription.update({ where: { id }, data });
      }

      return json({ success: true });
    } catch (error) {
      return json({ success: false, error: error.message });
    }
  }

  if (actionType === "delete") {
    try {
      const id = formData.get("id");
      await prisma.subscription.delete({ where: { id } });
      return json({ success: true });
    } catch (error) {
      return json({ success: false, error: error.message });
    }
  }
};

export default function SubscriptionPage() {
  const { subscriptions } = useLoaderData();
  const actionData = useActionData();
  const fetcher = useFetcher();
  const [editData, setEditData] = useState(null);

  const handleSuccess = actionData?.success ? (
    <p>Action completed successfully!</p>
  ) : null;

  return (
    <div>
      <h1>Manage Subscriptions</h1>


      {handleSuccess}

      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

    
      <div className="form-container">
      
        <Form method="post">
          <input
            type="hidden"
            name="_action"
            value={editData ? "edit" : "create"}
          />
          {editData && <input type="hidden" name="id" value={editData.id} />}
          <SubscriptionForm data={editData} />
          <button type="submit" className="sub_btn">
            {editData ? "Save Changes" : "Create Subscription"}
          </button>
          {editData && (
            <button type="button" onClick={() => setEditData(null)}>
              Cancel Edit
            </button>
          )}
        </Form>
      </div>

  
      <h2>Subscriptions</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Customer ID</th>
              <th>Subscription Cycle</th>
              <th>Pricing</th>
              <th>Auto Renewal</th>
              <th>Trial Period</th>
              <th>Duration</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.title}</td>
                <td>{sub.status}</td>
                <td>{sub.customerId}</td>
                <td>{sub.subscriptionCycle}</td>
                <td>{sub.pricing}</td>
                <td>{sub.autoRenewal ? "Yes" : "No"}</td>
                <td>
                  {sub.trialPeriodDays} days / {sub.trialPeriodWeeks} weeks
                </td>
                <td>
                  {new Date(sub.durationFrom).toLocaleDateString()} -{" "}
                  {new Date(sub.durationTo).toLocaleDateString()}
                </td>
                <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button className="edit" onClick={() => setEditData(sub)}>
                      Edit
                    </button>
                    <fetcher.Form method="post">
                      <input type="hidden" name="_action" value="delete" />
                      <input type="hidden" name="id" value={sub.id} />
                      <button className="delete" type="submit">
                        Delete
                      </button>
                    </fetcher.Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubscriptionForm({ data = {} }) {
 
  const formData = data || {};

  return (
    <>
      <label>
        Title:
        <input
          type="text"
          name="title"
          defaultValue={formData.title || ""}
          required
        />
      </label>
      <label>
        Status:
        <select name="status" defaultValue={formData.status || "Active"}>
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
          defaultValue={formData.durationFrom?.slice(0, 10) || ""}
          required
        />
      </label>
      <label>
        Duration To:
        <input
          type="date"
          name="durationTo"
          defaultValue={formData.durationTo?.slice(0, 10) || ""}
          required
        />
      </label>
      <label>
        Subscription Cycle:
        <select
          name="subscriptionCycle"
          defaultValue={formData.subscriptionCycle || "Weekly"}
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
          defaultValue={formData.pricing || ""}
          step="0.01"
          required
        />
      </label>
      <label>
        Customer ID:
        <input
          type="text"
          name="customerId"
          defaultValue={formData.customerId || ""}
          required
        />
      </label>
      <label>
        Auto-Renewal:
        <input
          type="checkbox"
          name="autoRenewal"
          defaultChecked={formData.autoRenewal || false}
        />
      </label>
      <label>
        Trial Period Days:
        <input
          type="number"
          name="trialPeriodDays"
          defaultValue={formData.trialPeriodDays || ""}
        />
      </label>
      <label>
        Trial Period Weeks:
        <input
          type="number"
          name="trialPeriodWeeks"
          defaultValue={formData.trialPeriodWeeks || ""}
        />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          name="startDate"
          defaultValue={formData.startDate?.slice(0, 10) || ""}
          required
        />
      </label>
    </>
  );
}

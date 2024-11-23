import { useState } from "react";

function SubscriptionForm() {
  const [customerId, setCustomerId] = useState("");
  const [subscriptionCycle, setSubscriptionCycle] = useState("monthly");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pricing, setPricing] = useState("");
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [trialPeriodDays, setTrialPeriodDays] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingSubscription, setEditingSubscription] = useState(null); // Track the subscription being edited

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title,
      startDate,
      endDate,
      subscriptionCycle,
      pricing,
      customerId,
      autoRenewal,
      trialPeriodDays,
    };

    if (editingSubscription) {
      // If editing, update the subscription in the list
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === editingSubscription.id ? { ...sub, ...formData } : sub,
        ),
      );
    } else {
      // If creating a new subscription, add to the list
      const newSubscription = { id: Date.now(), ...formData };
      setSubscriptions([...subscriptions, newSubscription]);
    }

    // Reset the form
    setTitle("");
    setStartDate("");
    setEndDate("");
    setPricing("");
    setCustomerId("");
    setAutoRenewal(false);
    setTrialPeriodDays("");
    setEditingSubscription(null);
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setTitle(subscription.title);
    setStartDate(subscription.startDate);
    setEndDate(subscription.endDate);
    setPricing(subscription.pricing);
    setCustomerId(subscription.customerId);
    setAutoRenewal(subscription.autoRenewal);
    setTrialPeriodDays(subscription.trialPeriodDays);
  };

  const handleDelete = (subscriptionId) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.id !== subscriptionId),
      );
    }
  };

  return (
    <div className="subscription-form">
      <h1>Create or Edit Subscription</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subscriptionCycle">Subscription Cycle</label>
          <select
            id="subscriptionCycle"
            name="subscriptionCycle"
            value={subscriptionCycle}
            onChange={(e) => setSubscriptionCycle(e.target.value)}
            required
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pricing">Pricing</label>
          <input
            id="pricing"
            type="number"
            name="pricing"
            step="0.01"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerId">Customer ID</label>
          <input
            id="customerId"
            type="text"
            name="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="autoRenewal">Auto-Renewal</label>
          <input
            id="autoRenewal"
            type="checkbox"
            name="autoRenewal"
            checked={autoRenewal}
            onChange={() => setAutoRenewal((prev) => !prev)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="trialPeriodDays">Trial Period (Days)</label>
          <input
            id="trialPeriodDays"
            type="number"
            name="trialPeriodDays"
            value={trialPeriodDays}
            onChange={(e) => setTrialPeriodDays(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">
            {editingSubscription ? "Save" : "Submit"}
          </button>
        </div>
      </form>

      <h2>Subscription List</h2>
      <table className="subscription-grid">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Subscription Cycle</th>
            <th>Pricing</th>
            <th>Customer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td>{subscription.title}</td>
              <td>{subscription.autoRenewal ? "Active" : "Inactive"}</td>
              <td>{`${new Date(subscription.startDate).toLocaleDateString()} - ${new Date(subscription.endDate).toLocaleDateString()}`}</td>
              <td>{subscription.subscriptionCycle}</td>
              <td>{`$${subscription.pricing}`}</td>
              <td>{subscription.customerId}</td>
              <td>
                <button onClick={() => handleEdit(subscription)}>Edit</button>
                <button onClick={() => handleDelete(subscription.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubscriptionForm;

import React, { useRef } from "react";

const POS = () => {
  const receiptRef = useRef();

  const receiptData = {
    businessName: "Tash's POS",
    date: new Date().toLocaleString(),
    items: [
      { name: "Item A", quantity: 2, price: 50 },
      { name: "Item B", quantity: 1, price: 30 },
    ],
    total: 130,
    paymentMethod: "Cash",
  };

  const printReceipt = () => {
    try {
      if (receiptRef.current) {
        const printContents = receiptRef.current.innerHTML;
        const printWindow = window.open("", "_self");

        // Write the receipt content to the new window
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2, h3 { margin: 0; }
                ul { padding: 0; list-style: none; }
                hr { border: none; border-top: 1px solid #000; margin: 10px 0; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();

        // Attempt to print
        const printResult = printWindow.print();
        if (printResult === undefined) {
          alert("No printer is connected or the print operation was canceled.");
        }
      }
    } catch (error) {
      alert("An error occurred while trying to print. Please check your printer connection.");
      console.error("Print error:", error);
    }
  };

  return (
    <div>
      <div ref={receiptRef} style={{ display: "none" }}>
        <h2>{receiptData.businessName}</h2>
        <p>{receiptData.date}</p>
        <hr />
        <ul>
          {receiptData.items.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity} - ${item.price}
            </li>
          ))}
        </ul>
        <hr />
        <h3>Total: ${receiptData.total}</h3>
        <p>Payment Method: {receiptData.paymentMethod}</p>
      </div>
      <button onClick={printReceipt}>Confirm & Print</button>
    </div>
  );
};

export default POS;

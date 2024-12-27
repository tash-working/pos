import React, { useRef } from "react";

const POS = () => {
  const cliptRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups for printing.");
      return;
    }

    const content = cliptRef.current?.innerHTML;
    if (!content) {
      console.error("Clipt content not found!");
      printWindow.close();
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
            <html>
                <head>
                    <title>Order Clipt</title>
                    <style>
                        body {
                            margin: 0; /* Remove default margins */
                            padding: 20px;
                            font-family: Arial, sans-serif;
                        }
                        #clipt-content {
                            width: 210mm; /* A4 width */
                            box-sizing: border-box;
                        }
                        /* Add any other necessary styles here */
                    </style>
                </head>
                <body>
                    <div id="clipt-content">
                        ${content}
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        };
                    <\/script>
                </body>
            </html>
        `);
    printWindow.document.close();
  };

  return (
    <div>
      <div
        ref={cliptRef}
        style={{
          textAlign: "left",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          width: "210mm",
          boxSizing: "border-box",
        }}
      >
        {/* Your order clipt content here */}
        <h1>Order Clipt</h1>
        <p>Order ID: 12345</p>
        <p>Date: 2024-10-27</p>
        <ul>
          <li>Item 1: Quantity 2</li>
          <li>Item 2: Quantity 1</li>
          <li>Item 3: Quantity 3</li>
        </ul>
        {/* Add more content as needed */}
      </div>
      <button onClick={handlePrint}>Print Order Clipt</button>
    </div>
  );
};

export default POS;

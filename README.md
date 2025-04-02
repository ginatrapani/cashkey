
# 💸 Cashkey - Visualize your cash flow

Cashkey is a web application that helps users visualize their annual cash flow with a Sankey diagram. The app makes it easy to track income sources and expenses, see the balance, and share the visualization with others.

## Why

- Money is like water. It flows in and out of our lives.
- Many people don’t know how their money comes and goes.
- Sankey diagrams are great for visualizing things that flow. 
- Sankey diagrams are not a chart type offered natively in spreadsheet apps. Sankey makers (like the awesome [Sankeymatic](https://sankeymatic.com/build/)) still require markup and math that's easy to botch.
- Cashkey builds a Sankey diagram your cash flow quickly and easily and keeps it private-no data gets sent to a server or stored in a database, it's all in the URL you can choose to bookmark or share.

## Features

- Interactive Sankey diagram showing income and expense flows
- Displays each income and expense as a percentage of the total
- Shows budget surplus or deficit
- Add multiple income sources and expenses
- Enter amounts as either monthly or annual values
- Responsive design works on desktop, tablet, and mobile devices
- All data is stored in the URL for easy sharing and privacy
- No server-side processing or storage of user data

## Technologies

- React.js for the user interface
- D3 Sankey diagram for visualization
- Tailwind CSS for styling
- Shadcn/UI for UI components
- URL-based data persistence

## How to Use

1. Add your income sources with their amounts
2. Add your expenses with their amounts
3. View the Sankey diagram to visualize your cashflow
4. Share your cashflow diagram using the "Share" button

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Getting Started

```bash
# Clone the repository
git clone https://github.com/ginatrapani/cashkey.git
cd cashkey

# Install dependencies
npm install

# Start the development server
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

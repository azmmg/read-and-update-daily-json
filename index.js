const fs = require('fs').promises;

async function main(data, action) {
  action = action || 'help';
  try {
    let jsonData;

    // Read the file for all actions except 'reset'
    if (action !== 'reset') {
      const dataString = await fs.readFile('data.json', 'utf8');
      jsonData = JSON.parse(dataString);
    }

    switch (action) {
      case 'help':
        //console.log('Available actions: help, reset, showAll, showOne, append, overwrite, delete');
        break;
      case 'reset':
        jsonData = { meta: "Random Integers", generator: "PHP Random Value Generator", dailyData: [] };
        break;

      case 'showAll':
        return jsonData.dailyData;

      case 'showOne':
        if (!data || !data.date) throw new Error("Date is required for 'showOne' action");
        const foundItem = jsonData.dailyData.find(item => item.date === data.date);
        if (!foundItem) throw new Error(`No data found for date: ${data.date}`);
        return foundItem;

      case 'append':
        if (!data) throw new Error("Data is required for 'append' action");
        jsonData.dailyData.push(data);
        break;

      case 'overwrite':
        if (!data || !data.date) throw new Error("Data with date is required for 'overwrite' action");
        const index = jsonData.dailyData.findIndex(item => item.date === data.date);
        if (index === -1) throw new Error(`No existing data found for date: ${data.date}`);
        jsonData.dailyData[index] = data;
        break;

      case 'delete':
        if (!data || !data.date) throw new Error("Date is required for 'delete' action");
        const initialLength = jsonData.dailyData.length;
        jsonData.dailyData = jsonData.dailyData.filter(item => item.date !== data.date);
        if (jsonData.dailyData.length === initialLength) throw new Error(`No data found for date: ${data.date}`);
        break;

      default:
        throw new Error(`Invalid action: ${action}`);
    }

    // Write the file for all actions except 'help', 'showAll' and 'showOne'
    if (action !== 'help' && action !== 'showAll' && action !== 'showOne') {
      await fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8');
    }

    return (action === 'help') ? { success: true, message: "Available actions: help, reset, showAll, showOne, append, overwrite, delete" } : { success: true, message: `Action '${action}' completed successfully`, data: jsonData };
  } catch (error) {
    console.error(`Error in main function: ${error.message}`);
    return { success: false, message: error.message };
  }
}

// Example usage:
// main() for 'help'
// main(null,'reset') -- same for help, showAll
// main({ date: "05.07.2024"}, 'delete')  -- same for showOne
// main({ date: "05.07.2024", Besucher: 2500, Besuche: 3800, Seitenabrufe: 4500 }, 'append') -- same for overwrite 
main({ date: "01.07.2024", Besucher: 2500, Besuche: 3800, Seitenabrufe: 4500 }, 'append')
   .then(result => console.log(result))
   .catch(error => console.error(error));
const initialData = [
  [
    1725431580000,
    "58478.00000000",
    "58478.01000000",
    "58407.00000000",
    "58420.32000000",
    "23.92792000",
    1725431639999,
    "1350350.56300540",
    1886,
    "11.53532000",
    "651001.37291650",
    "0"
  ],
  [
    1725431940000,
    "58472.04000000",
    "58479.98000000",
    "58438.00000000",
    "58442.17000000",
    "41.20783000",
    1725431999999,
    "2326319.50689900",
    1994,
    "23.43857000",
    "1323007.88290100",
    "0"
  ]
]

$(document).ready(function () {
  const $bidsElement = $('#bids');
  const $asksElement = $('#asks');
  const $currentPriceElement = $('#current-price');
  const $bidsHisElement = $('#bidsHistory');

  let ws;
  let selectedPair = "btcusdt";
  let chart;

  function setupOrderBook(pair) {
    $.getJSON(`http://127.0.0.1:5000/get_chart`)
      .done(function (data) {
        orderBookData = data;
        updateOrderBook(orderBookData.b, $bidsElement, true);
        updateOrderBook(orderBookData.a, $asksElement, false);
      })
      .fail(function () {
        console.error('Error fetching Kline data');
      })
      .always(() => {
        setTimeout(setupOrderBook, 10000);
      });
  }

  function updateOrderBook(data, $element, isBid) {
    $element.empty();

    $.each(data.filter(order => parseFloat(order[1]) != 0).slice(0, 17), function (index, order) {
      const price = parseFloat(order[0]).toFixed(2);
      const amount = parseFloat(order[1]).toFixed(6);
      const total = (parseFloat(order[0]) * parseFloat(order[1])).toFixed(6);

      const orderElement = `
              <div class="row w-100">
                  <div class="col-4 text-${isBid ? "danger" : "success"}">${price}</div>
                  <div class="col-4 text-right">${amount}</div>
                  <div class="col-4 text-right">${total}</div>
              </div>
          `;

      $element.append(orderElement);
    });
  }

  function setupTradingViewChart(initialData) {
    if (initialData) {
      chart = klinecharts.init('chart-container'); // Initialize chart in the div
      const data = initialData;
      const formattedData = data.map(item => ({
        timestamp: item[0],  // Open time
        open: item[1],       // Open price
        high: item[2],       // High price
        low: item[3],        // Low price
        close: item[4],      // Close price
        volume: item[5]      // Volume
      }));
      $currentPriceElement.text(Number(data[data.length - 1][4]).toFixed(2))

      chart.applyNewData(formattedData);  // Apply the data to Kline chart
      setupTradingViewChart();
    } else {
      // Fetch Kline chart data from Binance API
      $.getJSON(`http://127.0.0.1:5000/get_data`)
        .done(function (data) {
          chart.clearData();
          const formattedData = data.map(item => ({
            timestamp: item[0],  // Open time
            open: item[1],       // Open price
            high: item[2],       // High price
            low: item[3],        // Low price
            close: item[4],      // Close price
            volume: item[5]      // Volume
          }));
          $currentPriceElement.text(Number(data[data.length - 1][4]).toFixed(2))

          chart.applyNewData(formattedData);  // Apply the data to Kline chart
        })
        .fail(function () {
          console.error('Error fetching data');
        })
        .always(() => {
          setTimeout(setupTradingViewChart, 10000);
        });
    }
  }


  function getTradeHistory() {
    $.getJSON(`http://127.0.0.1:5000/get_trade_history`)
      .done(function (data) {
        updateHistory(data);
      })
      .fail(function () {
        console.error('Error fetching data');
      })
      .always(() => {
        setTimeout(getTradeHistory, 10000);
      });
  }

  function updateHistory(data) {
    $bidsHisElement.empty();

    $.each(data.filter(order => parseFloat(order[1]) != 0).slice(0, 17), function (index, order) {
      const price = parseFloat(order[0]).toFixed(2);
      const amount = parseFloat(order[1]).toFixed(6);
      const total = (parseFloat(order[0]) * parseFloat(order[1])).toFixed(6);

      const orderElement = `
                <div class="row w-100">
                    <div class="col-4 text-${order[3] ? "danger" : "success"}">${price}</div>
                    <div class="col-4 text-right">${amount}</div>
                    <div class="col-4 text-right">${total}</div>
                </div>
            `;

      $bidsHisElement.append(orderElement);
    });
  }

  $('.buyButton').on('click', function () {
    var req_price = $('.buyUsdt').val();  
    var req_quantity = $('.buyAmount').val();  

    if (!req_price || !req_quantity) {
      alert("Please fill in both fields.");
      return;
    }

    $.ajax({
      url: 'http://127.0.0.1:5000/buy',  
      type: 'POST',
      contentType: 'application/json', 
      data: JSON.stringify({
        req_price: req_price,    
        req_quantity: req_quantity  
      }),
      success: function (response) {
        // Handle success
        console.log("Success:", response);
        alert("Purchase Successful!");
      },
      error: function (xhr, status, error) {
        // Handle error
        console.log("Error:", error);
        alert("Purchase Failed: " + error);
      }
    });
  });

  $('.sellButton').on('click', function () {
    var req_price = $('.sellUsdt').val();
    var req_quantity = $('.sellAmount').val();

    if (!req_price || !req_quantity) {
      alert("Please fill in both fields.");
      return;
    }

    $.ajax({
      url: 'http://127.0.0.1:5000/sell',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        req_price: req_price,
        req_quantity: req_quantity
      }),
      success: function (response) {
        // Handle success
        console.log("Success:", response);
        alert("Purchase Successful!");
      },
      error: function (xhr, status, error) {
        // Handle error
        console.log("Error:", error);
        alert("Purchase Failed: " + error);
      }
    });
  });

  setupOrderBook(selectedPair);
  setupTradingViewChart(initialData);
  getTradeHistory();
});

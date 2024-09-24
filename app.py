from flask import Flask, jsonify, render_template, g, request
from datetime import datetime
import mysql.connector
import json
import time

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "exchange",
    "port": 3306,
}

app = Flask(__name__)

@app.before_request
def before_request():
    g.db = mysql.connector.connect(**DB_CONFIG)
    g.cursor = g.db.cursor()


# Close the connection after each request
@app.teardown_request
def teardown_request(exception):
    cursor = getattr(g, "cursor", None)
    db = getattr(g, "db", None)
    if cursor is not None:
        cursor.close()
    if db is not None:
        db.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_data")
def get_data():
    try:

        g.cursor.execute("SELECT timestamp,open,high,low,close,volume FROM price_log")

        # Fetch and print the results
        results = g.cursor.fetchall()

        json_res = json.dumps(results)

        return json_res
    except Exception as err:
        return str(err)


@app.route("/get_chart")
def get_chart():
    current_time = int(time.time())

    g.cursor.execute(
        "SELECT req_price , SUM(req_quantity) , SUM(total) FROM transactions WHERE type=0 GROUP BY req_price ORDER BY id DESC LIMIT 100"
    )

    buy_result = g.cursor.fetchall()

    g.cursor.execute(
        "SELECT req_price , SUM(req_quantity) , SUM(total) FROM transactions WHERE type=1 GROUP BY req_price ORDER BY id DESC LIMIT 100"
    )

    sell_result = g.cursor.fetchall()

    # sell_json = json.dumps(sell_result)

    response = {
        "e": "depthUpdate",
        "E": current_time,
        "s": "BTCUSDT",
        "U": current_time,
        "u": current_time,
        "b": sell_result,
        "a": buy_result,
    }

    return response


@app.route("/get_trade_history")
def trade_history():

    query = "SELECT req_price , req_quantity , total,type FROM transactions WHERE user_id=1 ORDER BY id DESC LIMIT 100 "

    g.cursor.execute(query)

    result = g.cursor.fetchall()

    return result


@app.route("/buy", methods=['POST'])
def buy():
    try:
        data = request.json  # Get JSON data from the request
        price = float(data.get("req_price"))
        quantity = float(data.get("req_quantity"))

        total = price * quantity

        query = """ INSERT INTO transactions (`user_id`,`pair`,`type`,`req_price`,`req_quantity`,`total`,`createtime`)  VALUES
                    (%s, %s ,%s, %s , %s, %s, %s )
                    """
        record_to_insert = (1, "btcusdt", 0, price, quantity, total, time.time())

        g.cursor.execute(query, record_to_insert)

        g.db.commit()

        query_1 = """ INSERT INTO price_log (`pair`,`timestamp`,`open`,`high`,`low`,`close`,`volume`)  VALUES 
                    (%s,%s,%s,%s,%s,%s,%s ) """
        
        inser_data = ("btcusdt",time.time(),price,price,price,price,quantity)

        g.cursor.execute(query_1, inser_data)

        g.db.commit()

        return jsonify(
            {"message": "Purchase processed", "price": price, "quantity": quantity}
        )

    except Exception as e:
        return jsonify({"message": str(e)})
    

@app.route("/sell", methods=['POST'])
def sell():
    try:
        data = request.json  # Get JSON data from the request
        price = float(data.get("req_price"))
        quantity = float(data.get("req_quantity"))

        total = price * quantity

        query = """ INSERT INTO transactions (`user_id`,`pair`,`type`,`req_price`,`req_quantity`,`total`,`createtime`)  VALUES
                    (%s, %s ,%s, %s , %s, %s, %s )
                    """
        record_to_insert = (1, "btcusdt", 1, price, quantity, total, time.time())

        g.cursor.execute(query, record_to_insert)

        g.db.commit()

        query_1 = """ INSERT INTO price_log (`pair`,`timestamp`,`open`,`high`,`low`,`close`,`volume`)  VALUES 
                    (%s,%s,%s,%s,%s,%s,%s ) """
        
        inser_data = ("btcusdt",time.time(),price,price,price,price,quantity)

        g.cursor.execute(query_1, inser_data)

        g.db.commit()

        return jsonify(
            {"message": "Sell processed", "price": price, "quantity": quantity}
        )

    except Exception as e:
        return jsonify({"message": str(e)})
    


if __name__ == "__main__":
    # Run the Flask app
    app.run()

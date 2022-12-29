from flask import Flask, render_template, redirect, request
import zeep
import datetime
import requests
import json
import time

app = Flask(__name__)

app.static_folder = 'static'

wsdl = "./wsdl/calculator.wsdl"
client = zeep.Client(wsdl=wsdl) 

apodLink = "https://api.nasa.gov/planetary/apod?api_key=kDelHyMgafZmC9iy1pBbX37JklDK3bc4pPPRmsRg"

REGISTRANTS = {}
LOGS = {}
ISLEMLER = [
    "Toplama",
    "Cikarma",
    "Carpma",
    "Bolme",
    ]

CURRENCY = {}
response = requests.get("http://127.0.0.1:3000/log")
apodUrl = requests.get(apodLink)
apod=apodUrl.json()['hdurl']

@app.route("/")
def index():
    try:
        para = float(request.args.get('para'))
    except:
        para=1

    #print(response.json())
    for i in range(8):
        rate = response.json()['currencies'][i]['inverseRate']
        name = response.json()['currencies'][i]['name']
        flag = response.json()['currencies'][i]['alphaCode']
        url = "http://www.oorsprong.org/WebSamples.CountryInfo/Flags/" +flag+".jpg"
        CURRENCY[name] = [rate,url,para]

    return render_template("index.html", islemler=ISLEMLER,currency=CURRENCY,apod = apod)


@app.route("/liste", methods=["POST"])
def register():  
    try:
        first = int(request.form.get("first"))
        second = int(request.form.get("second"))
    except:
        first = 1
        second = 1
    islem = request.form.get("islem")
    if islem == ISLEMLER[1]:
        sonuc = client.service.Subtract(first,second)
    elif islem == ISLEMLER[0]:
        sonuc = client.service.Add(first,second)
    elif islem == ISLEMLER[2]:
        sonuc = client.service.Multiply(first,second)
    elif islem == ISLEMLER[3]:
        try:
            sonuc = float(first)/float(second)
        except:
            sonuc = "Null"
    date=datetime.datetime.now().isoformat(sep=" ", timespec="seconds")
    REGISTRANTS[date] = [first,second,islem,sonuc]
    with open("./grpc/apiPath/aps.json", "w") as outfile:
        json.dump(REGISTRANTS, outfile)
    import subprocess
    command = "cd C:/Users/Acer/Desktop/enroll-sport-flask-py-main/grpc & node client.js"
    subprocess.check_output(command, shell=True)
    #len(grpcRes.json()["date"])
    grpcRes = requests.get("http://127.0.0.1:3000/grpcApi")

    for i in range(len(grpcRes.json())):
        tarih = grpcRes.json()[i]['date']
        ilk = grpcRes.json()[i]['first']
        iki = grpcRes.json()[i]['second']
        opr = grpcRes.json()[i]['operation']
        rslt = grpcRes.json()[i]['result']
        LOGS[tarih] = [ilk,iki,opr,rslt]

    return render_template("registrants.html", registrants=LOGS,apod = apod)

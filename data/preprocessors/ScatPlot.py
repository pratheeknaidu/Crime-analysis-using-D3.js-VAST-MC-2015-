
o = pd.read_csv("/content/soham.csv")
labdic={}
for i in o.iterrows():
  labdic[int(i[1][0])] = int(i[1][1])
print(labdic)


import pandas as pd
import json 
dat = pd.read_csv("/content/Friday-Sunday-OnlyCheckIn.csv")
pat = pd.read_csv("/content/Ride-Details.csv")
l = list(map(int, sorted(pat["Park Guide Index"].unique())))
t1 = {i:[0]*5 for i in l}
t2 = {i:[0]*5 for i in l}
t3 = {i:[0]*5 for i in l}


for row in dat.iterrows():
  if row[1][0][8] == "6":
    
    t1[int(row[1][5])][labdic[int(row[1][1])]]+=1


  if row[1][0][8] == "7":


    t2[int(row[1][5])][labdic[int(row[1][1])]]+=1



  if row[1][0][8] == "8":

    t3[int(row[1][5])][labdic[int(row[1][1])]]+=1

with open("ScatPlot_fri.json","w") as f:
  json.dump(t1,f)
with open("ScatPlot_sat.json","w") as f:
  json.dump(t2,f)
with open("ScatPlot_sun.json","w") as f:
  json.dump(t3,f)

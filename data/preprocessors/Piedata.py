dic = {}
# print(df_main.head())
for row in df_main.iterrows():
  if row[1][1] in dic:
    if row[1][8] == "Entrance":
      dic[row[1][1]][0] += 1
    elif row[1][8] == "Everybody":
      dic[row[1][1]][1] += 1
    elif row[1][8] == "First Aid":
        dic[row[1][1]][2] += 1
    if row[1][8] == "Kiddie":
        dic[row[1][1]][3] += 1
    elif row[1][8] == "Pavilion":
        dic[row[1][1]][4] += 1
    elif row[1][8] == "Show Hall":
        dic[row[1][1]][5] += 1
    elif row[1][8] == "Stage":
        dic[row[1][1]][6] += 1
    elif row[1][8] == "Thrill":
        dic[row[1][1]][7] += 1
  else:
    dic[row[1][1]] = [0]*8
    if row[1][8] == "Entrance":
      dic[row[1][1]][0] = 1
    elif row[1][8] == "Everybody":
      dic[row[1][1]][1] = 1
    elif row[1][8] == "First Aid":
        dic[row[1][1]][2] = 1
    if row[1][8] == "Kiddie":
        dic[row[1][1]][3] = 1
    elif row[1][8] == "Pavilion":
        dic[row[1][1]][4] = 1
    elif row[1][8] == "Show Hall":
        dic[row[1][1]][5] = 1
    elif row[1][8] == "Stage":
        dic[row[1][1]][6] = 1
    elif row[1][8] == "Thrill":
        dic[row[1][1]][7] = 1

print(dic)
dct = {key:{k:[0,0,0,0,0] for k in dic[key]} for key in dic}

for key in dic:
  for k in dic[key]:
    for j in range(0,5):
      dct[key][k][j]+=dic1[key][k][j]
      dct[key][k][j]+=dic2[key][k][j]
      dct[key][k][j]+=dic3[key][k][j]
with open('Fri_Sun_pie.json', 'w') as outfile:
    json.dump(dct, outfile)
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

print(t1)

parkmapp = {int(row[1][0]):row[1][1] for row in pat.iterrows()}
print(parkmapp)

mappark = {v:k for (k,v) in parkmapp.items()}
print(mappark)

dic = {key:[] for key in dat['type'].unique()}
print(dic)

for row in dat.iterrows():
  if parkmapp[int(row[1][5])] not in dic[row[1][8]]:
    dic[row[1][8]].append(parkmapp[int(row[1][5])])
print(dic)

dic1 = {key:{k:[0,0,0,0,0] for k in dic[key]} for key in dic}
dic2 = {key:{k:[0,0,0,0,0] for k in dic[key]} for key in dic}

dic3 = {key:{k:[0,0,0,0,0] for k in dic[key]} for key in dic}

print(dic1)

for key in dic:
  for k in dic[key]:
    for val in range(0,5):
      dic1[key][k][val]+=t1[mappark[k]][val]
      dic2[key][k][val]+=t2[mappark[k]][val]
      dic3[key][k][val]+=t3[mappark[k]][val]

print(dic1)
print(dic2)
print(dic3)

with open('Pie_fri.json', 'w') as outfile:
    json.dump(dic1, outfile)
with open('Pie_sat.json', 'w') as outfile:
    json.dump(dic2, outfile)
with open('Pie_sun.json', 'w') as outfile:
    json.dump(dic3, outfile)

print(dct)

dct = {key:{k:[0,0,0,0,0] for k in dic[key]} for key in dic}

for key in dic:
  for k in dic[key]:
    for j in range(0,5):
      dct[key][k][j]+=dic1[key][k][j]
      dct[key][k][j]+=dic2[key][k][j]
      dct[key][k][j]+=dic3[key][k][j]
with open('Fri_Sun_pie.json', 'w') as outfile:
    json.dump(dct, outfile)
print(dct)

clusters = {'cluster1':[],'cluster2':[],'cluster3':[],'cluster4':[],'cluster5':[]}
clus = pd.read_csv("/content/Clusters.csv")
for i,key in enumerate(clusters.keys()):
  for j,col in enumerate(list(clus.columns)):
    if j==0:
      continue
    clusters[key].append({'name':f'{col}','value':clus[f'{col}'].iloc[i],'cluster':i+1})
print(clusters)

with open('clusters_new.json','w') as f:
  json.dump(clusters,f)

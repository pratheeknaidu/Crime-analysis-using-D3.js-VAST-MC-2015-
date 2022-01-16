# -*- coding: utf-8 -*-
"""dv.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1qBjcSIIK8gTNLoAJ5kF693BglWqLsogB
"""

import pandas as pd
def func(i):

  df = pd.read_csv("/content/drive/MyDrive/Data Visualization/CSE-578-group2/data/cluster_"+str(i)+"_Sunday.csv")
  df = df.sum(axis = 0)[1:]
  df=pd.DataFrame(df)

  return df.to_dict()[0]

d0 = func(0)
d1 = func(1)
d2 = func(2)
d3 = func(3)
d4 = func(4)
res = {}
for i in d0:
  res[i] = [d0[i], d1[i], d2[i], d3[i], d4[i]]
print(res)

for i in res:
  res[i] = list(map(int, res[i]))
print(res)

import json
with open('Spot_Clus_Sun.json', 'w') as f:
  json.dump(res, f)


import pandas as pd
from datetime import timedelta


def create_csv(filename, week):
    df_ride = pd.read_csv("Ride-Details.csv")
    df_day = pd.read_csv(filename)
    df_usermap = pd.read_csv("person-cluster-map.csv")
    df_lookup = pd.read_csv("lookup.csv")
    df_lookup['Timestamp'] = pd.to_datetime(df_lookup["Timestamp"])
    
    delta = 0
    
    if week == 'Saturday':
        delta = 1
    elif week == 'Sunday':
        delta = 2
        
    df_lookup["Timestamp"] = df_lookup["Timestamp"] + timedelta(days=delta)
        
    

    # In[2]:

    df_day = df_day[df_day['type'] == 'check-in']
    df_day["Timestamp"] = pd.to_datetime(df_day["Timestamp"])
    df_day["Timestamp"] = df_day["Timestamp"].dt.round("15min")
    df_ride = df_ride.rename(columns={"x-coor entrance": "X", "y-coor entrance": "Y"})

    df_join = pd.merge(df_ride,df_day,  how="left", on=["X", "Y"])
    df_join_final = pd.merge(df_join, df_usermap, how="left", left_on=["id"], right_on=["index"])



    # In[47]:

    df_cluster_array = [None] * 5
    for i in range(5):
        df_cluster_array[i] = df_join_final[df_join_final['label'] == i][['id', 'Timestamp', 'Park Guide Index']].groupby(
            ['Timestamp', 'Park Guide Index']).size().reset_index(name='counts')
        df_cluster_array[i] = pd.pivot_table(df_cluster_array[i], values='counts', columns='Park Guide Index',
                                             index='Timestamp', fill_value=0)
        df_cluster_array[i].to_csv('temp.csv')
        df_cluster = pd.read_csv("temp.csv")
        df_cluster['Timestamp'] = pd.to_datetime(df_cluster["Timestamp"])
        
        cols_to_use = df_lookup.columns.difference(df_cluster.columns)
        df_final = pd.merge(df_cluster, df_lookup[cols_to_use], left_index=True, right_index=True, how='outer')
        df_final = df_final.rename(columns = {'Timestamp':0})
        df_final.columns = df_final.columns.map(int)
        df_final = df_final.reindex(sorted(df_final.columns), axis=1).fillna(0)
        df_final = df_final.rename(columns = {0:'Timestamp'})
        
        df_final.to_csv(('cluster_' + str(i) + '_' + week + '.csv'),index = False)


raw_files = {'Friday': 'park-movement-Fri-FIXED-2.0.csv', 'Saturday': 'park-movement-Sat.csv', 'Sunday': 'park-movement-Sun.csv'}
for week, file in raw_files.items():
    create_csv(file, week)
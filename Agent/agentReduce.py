import pandas as pd
import pandasql as ps
import os
cDir = os.path.dirname(os.path.abspath(__file__))
import sys


def readParquet(path):
    return pd.read_parquet(path)


def executeQuery(query,df):
    return ps.sqldf(query, locals())


def writeOutput(path,df):
    df.to_csv(path)


if __name__ == '__main__':
    readPath = sys.argv[1]
    readPath1 = sys.argv[2]
    query = sys.argv[4]
    writePath = sys.argv[3]
    df = readParquet(readPath)
    df = df.append(readParquet(readPath1))
    df = executeQuery(query, df)
    writeOutput(writePath, df)

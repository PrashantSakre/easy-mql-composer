import json

import pymongo


class View:
    def connect(self, url):
        self.connection = pymongo.MongoClient(url)
        return self.get_dbs()

    def get_dbs(self):
        return json.dumps(self.connection.list_database_names())

    def get_db(self, db_name):
        return self.connection[db_name]

    def get_collections(self, db_name):
        collections = self.get_db(db_name).list_collection_names()
        return json.dumps(collections)

    def get_docs(self, db_name, collection_name, pipeline=None, session=None, **kwargs):
        collection = self.get_db(db_name)[collection_name]
        if pipeline is None:
            pipeline = []
        return collection.aggregate(pipeline, session=session, **kwargs)

    def disconnect(self):
        self.connection.close()

import json

import pymongo
from bson import json_util
from bson.objectid import ObjectId


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

    def get_docs(self, db_name, collection_name):
        collection = self.get_db(db_name)[collection_name]
        docs = collection.find({})
        return json_util.dumps(
            [doc for doc in docs], json_options=json_util.RELAXED_JSON_OPTIONS
        )

    def get_doc(self, db_name, collection_name, doc_id):
        collection = self.get_db(db_name)[collection_name]
        docs = collection.find({"_id": ObjectId(doc_id)})
        return json_util.dumps(
            [doc for doc in docs], json_options=json_util.RELAXED_JSON_OPTIONS
        )

    def disconnect(self):
        self.connection.close()

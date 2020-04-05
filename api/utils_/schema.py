import json

def extract_schema(schema, body):
    data = json.loads(body)
    result = dict()
    for k in schema.keys():
        v = schema[k]
        if type(v) is dict:
            result[k] = extract_schema(data[k], v)
        else:
            result[k] = v(data[k])
    return result


def try_extract_schema(schema, body):
    try:
        return extract_schema(schema, body)
    except Exception as e:
        print(e)
        return None

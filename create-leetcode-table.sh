curl -X POST "https://api.airtable.com/v0/meta/bases/{baseId}/tables" \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
--data '{
    "tables": [
        {
            "name": "Leetcode Activity",
            "description": "track my daily leetcode activity",
            "fields": [
                {
                    "type": "singleLineText",
                    "name": "problem"
                },
                {
                    "type": "url",
                    "name": "link"
                },
                {
                    "type": "richText",
                    "name": "difficulty"
                },
                {
                    "type": "singleLineText",
                    "name": "result"
                },
                {
                    "type": "date",
                    "options": {
                        "dateFormat": {
                            "name": "local",
                            "format": "l"
                        }
                    },
                    "name": "date"
                },
                {
                    "type": "singleLineText",
                    "name": "time elapsed"
                },
                {
                    "type": "singleLineText",
                    "name": "start"
                },
                {
                    "type": "singleLineText",
                    "name": "end"
                },
                {
                    "type": "number",
                    "options": {
                        "precision": 1
                    },
                    "name": "attempts"
                }
            ]
        }
    ]
}'
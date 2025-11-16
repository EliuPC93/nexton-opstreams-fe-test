import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

export class DataService implements InMemoryDbService {
    createDb() {
        return {
            schemas: [{
                "id": "software-request",
                "title": "Software Request",
                "sections": [
                    {
                        "id": "requested-item",
                        "title": "Requested Item",
                        "fields": [
                            {
                                "id": 1758177604,
                                "label": "Item Name",
                                "type": "text",
                                "required": true
                            },
                            {
                                "id": 75484637462,
                                "label": "Quantity",
                                "type": "number",
                                "required": true
                            }
                        ]
                    },
                    {
                        "id": "vendor-info",
                        "title": "Vendor Information",
                        "fields": [
                            {
                                "id": 4957463729,
                                "label": "Vendor Name",
                                "type": "text",
                                "required": true
                            },
                            {
                                "id": 8462736152,
                                "label": "Vendor Location",
                                "type": "radio",
                                "required": true,
                                "options": [
                                    "USA",
                                    "UK",
                                    "Other"
                                ]
                            },
                            {
                                "id": 6482937561,
                                "label": "Website",
                                "type": "text",
                                "required": false
                            }
                        ]
                    }
                ]
            }, {
                "id": "hardware-request",
                "title": "Hardware Request",
                "sections": [
                    {
                        "id": "requested-item",
                        "title": "Requested Item",
                        "fields": [
                            {
                                "id": 75329829348985,
                                "label": "Item Name",
                                "type": "text",
                                "required": true
                            },
                            {
                                "id": 85781623672346,
                                "label": "Quantity",
                                "type": "number",
                                "required": false
                            },
                            {
                                "id": 2389182391823812,
                                "label": "Requires shipping",
                                "type": "toggle",
                                "default": false
                            }
                        ]
                    },
                    {
                        "id": "vendor-info",
                        "title": "Vendor Information",
                        "fields": [
                            {
                                "id": 9542834823423,
                                "label": "Vendor Name",
                                "type": "text",
                                "required": true
                            },
                            {
                                "id": 5587934758234,
                                "label": "Vendor Location",
                                "type": "radio",
                                "required": true,
                                "options": [
                                    "USA",
                                    "UK",
                                    "Other"
                                ]
                            }
                        ]
                    }
                ]
            }],
            requests: [{
                id: 'requested-item',
                question: [
                    { id: 1758177604, value: 'Item Name' },
                    { id: 75484637462, value: 'Quantity' },
                    { id: 75329829348985, value: 'Item Name' },
                    { id: 85781623672346, value: 'Quantity' },
                    { id: 2389182391823812, value: true }
                ]
            }, {
                id: 'vendor-info',
                question: [
                    { id: 4957463729, value: 'Vendor Name' },
                    { id: 8462736152, value: 'Vendor Location' },
                    { id: 6482937561, value: 'Website' },
                    { id: 9542834823423, value: 'Vendor Name' },
                    { id: 5587934758234, value: 'Vendor Location' }
                ]
            }]
        };
    }

    put(reqInfo: RequestInfo): Observable<any> {
        const { req } = reqInfo;
        const url = req.url;

        console.log('PUT request received for URL:', url);
        // Match: /api/requests/:id/question/:questionId
        // request id can be a string (e.g. 'requested-item') so allow any non-slash segment
        const match = url.match(/\/?api\/requests\/([^\/]+)\/question\/(\d+)/);

        if (match) {
            const requestId = match[1]; // keep as string (ids in the DB may be strings)
            const questionId = Number(match[2]);

            // Access db
            const collection = reqInfo.collection as any[];
            const request = collection.find(r => String(r.id) === requestId);

            if (!request) {
                return reqInfo.utils.createResponse$(() => ({
                    status: 404,
                    body: { error: 'Request not found' }
                }));
            }

            // stored requests use the `question` array (singular) per createDb()
            const questionsArray = request.question || request.questions || [];
            const question = questionsArray.find((q: any) => q.id === questionId);

            if (!question) {
                return reqInfo.utils.createResponse$(() => ({
                    status: 404,
                    body: { error: 'Question not found' }
                }));
            }

            // Update the question with the PUT body
            Object.assign(question, (req as any).body);

            return reqInfo.utils.createResponse$(() => ({
                status: 200,
                body: question
            }));
        }

        return reqInfo.utils.createResponse$(() => ({
            status: 400,
            body: { error: 'Bad Request' }
        }));
    }
}

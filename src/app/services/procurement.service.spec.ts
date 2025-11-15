import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProcurementService } from './procurement.service';
import { ProductRequest } from '../product-requests';

describe('ProcurementService', () => {
  let service: ProcurementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProcurementService]
    });

    service = TestBed.inject(ProcurementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSchemas', () => {
    it('fetches schemas from api/schemas endpoint', (done) => {
      const mockSchemas: ProductRequest[] = [
        { id: 'software-request', title: 'Software Request', sections: [] },
        { id: 'hardware-request', title: 'Hardware Request', sections: [] }
      ];

      service.getSchemas().subscribe((schemas) => {
        expect(schemas).toEqual(mockSchemas);
        expect(schemas.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne('api/schemas');
      expect(req.request.method).toBe('GET');
      req.flush(mockSchemas);
    });

    it('handles empty schema list', (done) => {
      service.getSchemas().subscribe((schemas) => {
        expect(schemas).toEqual([]);
        done();
      });

      const req = httpMock.expectOne('api/schemas');
      req.flush([]);
    });

    it('handles HTTP errors gracefully', (done) => {
      service.getSchemas().subscribe(
        () => fail('should have errored'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne('api/schemas');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('submitRequest', () => {
    it('sends PUT request to correct endpoint with value', (done) => {
      const requestId = 'software-request';
      const questionId = 'q1';
      const value = 'answer text';

      service.submitRequest(requestId, questionId, value).subscribe((response) => {
        expect(response).toEqual({ id: questionId, value, title: '' });
        done();
      });

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ value });
      req.flush({ id: questionId, value, title: '' });
    });

    it('handles numeric question IDs', (done) => {
      const requestId = 'hardware-request';
      const questionId = '12345';
      const value = true;

      service.submitRequest(requestId, questionId, value).subscribe((response) => {
        expect(response.value).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      expect(req.request.method).toBe('PUT');
      req.flush({ id: questionId, value, title: '' });
    });

    it('submits various value types', (done) => {
      const requestId = 'software-request';
      const questionId = 'q2';
      const value = { nested: 'object' };

      service.submitRequest(requestId, questionId, value).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      expect(req.request.body).toEqual({ value });
      req.flush({});
    });

    it('handles submission errors', (done) => {
      const requestId = 'software-request';
      const questionId = 'q1';

      service.submitRequest(requestId, questionId, 'test').subscribe(
        () => fail('should have errored'),
        (error) => {
          expect(error.status).toBe(400);
          done();
        }
      );

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });
  });
});

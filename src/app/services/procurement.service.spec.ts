import { TestBed, fakeAsync, tick } from '@angular/core/testing';
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
    spyOn(Math, 'random').and.returnValue(0.5);
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
    it('sends PUT request to correct endpoint with value', fakeAsync(() => {
      const requestId = 'software-request';
      const questionId = 'q1';
      const value = 'answer text';
      let resp: any;
      service.submitRequest(requestId, questionId, value).subscribe((response) => {
        resp = response;
      });

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ value });
      req.flush({ id: questionId, value, title: '' });

      // advance past the internal delay
      tick(600);
      expect(resp).toEqual({ id: questionId, value, title: '' });
    }));

    it('handles numeric question IDs', fakeAsync(() => {
      const requestId = 'hardware-request';
      const questionId = '12345';
      const value = true;
      let resp: any;
      service.submitRequest(requestId, questionId, value).subscribe((response) => {
        resp = response;
      });

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      expect(req.request.method).toBe('PUT');
      req.flush({ id: questionId, value, title: '' });

      tick(600);
      expect(resp.value).toBe(true);
    }));

    it('submits various value types', fakeAsync(() => {
      const requestId = 'software-request';
      const questionId = 'q2';
      const value = { nested: 'object' };
      let completed = false;
      service.submitRequest(requestId, questionId, value).subscribe(() => {
        completed = true;
      });

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      expect(req.request.body).toEqual({ value });
      req.flush({});

      tick(600);
      expect(completed).toBeTrue();
    }));

    it('handles submission errors', fakeAsync(() => {
      const requestId = 'software-request';
      const questionId = 'q1';
      let err: any;
      service.submitRequest(requestId, questionId, 'test').subscribe(
        () => fail('should have errored'),
        (error) => {
          err = error;
        }
      );

      const req = httpMock.expectOne(`api/requests/${requestId}/question/${questionId}`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });

      // http error should be propagated immediately
      tick();
      expect(err.status).toBe(400);
    }));
  });
});

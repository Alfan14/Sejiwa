import pool from '../db/index.mjs'

// Kalkulasi skor berdasarkan jawaban
    // Buat objek/array untuk menyimpan hasil perhitungan skor
  class AssesmentService {
    constructor() {
        this.assessments = [];
    }
    answerAssessment() {
        const answer = [{code , label}];
        if (!answer) {
            return next({
              message: `Bad reques`,
              statusCode: 400,
            });
          }
        

    }
    addAssessment(assesment) {
        this.assessments.push({...assesment, id: this.assessments.length + 1});
        return this.assessments[this.assessments.length - 1];
    }
    getAllAssessments() {
        return this.assessments;
    }
    getAssesmentById(id) {
        return this.assessments.find(pet => pet.id === id);
    }

// Mapping ke rekomendasi
    // Query ke tabel assessment_recommendations
// Urutkan hasil berdasarkan skor
    // Hasil diurutkan berdasarkan skor terbesar.
        //Ambil detail rekomendasi dari tabel recommendations berdasarkan ID tersebut.
// Terakhir masuk rekomendasi
  }
export default AssesmentService;
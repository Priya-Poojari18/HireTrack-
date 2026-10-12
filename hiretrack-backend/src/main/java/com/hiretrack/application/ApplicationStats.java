package com.hiretrack.application;

public record ApplicationStats(
        long total,
        long inReview,
        long interviews,
        long offers,
        long rejected
) {
}
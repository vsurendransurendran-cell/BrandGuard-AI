from sqlalchemy.orm import Session

from models import BrandGuideline, ComplianceIssue


def check_compliance(content: str, db: Session):
    guidelines = (
        db.query(BrandGuideline)
        .filter(BrandGuideline.approved == True)
        .all()
    )

    issues = []
    normalized_content = content.lower()

    for guideline in guidelines:
        term = guideline.name.strip()

        if not term:
            continue

        normalized_term = term.lower()
        category = guideline.category.lower()

        if category == "prohibited_term":
            if normalized_term in normalized_content:
                issues.append({
                    "category": category,
                    "description": (
                        f"Prohibited term detected: {term}. "
                        f"{guideline.rule}"
                    ),
                    "severity": "high",
                    "suggested_fix": (
                        f"Remove or replace '{term}' with approved wording."
                    )
                })

        elif category == "required_term":
            if normalized_term not in normalized_content:
                issues.append({
                    "category": category,
                    "description": (
                        f"Required term missing: {term}. "
                        f"{guideline.rule}"
                    ),
                    "severity": "medium",
                    "suggested_fix": (
                        f"Include the required term '{term}'."
                    )
                })

    return issues


def save_compliance_results(submission, db: Session):
    issues = check_compliance(submission.content, db)

    for issue_data in issues:
        issue = ComplianceIssue(
            submission_id=submission.id,
            **issue_data
        )
        db.add(issue)

    submission.compliance_score = max(
        0,
        100 - (len(issues) * 20)
    )

    submission.status = "needs_review" if issues else "compliant"

    db.commit()
    db.refresh(submission)

    return submission
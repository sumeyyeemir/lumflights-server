export class DateFilterUtil {
  static applyDateFilter(
    query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
    startDate?: string,
    endDate?: string,
  ): FirebaseFirestore.Query<FirebaseFirestore.DocumentData> {
    if (startDate && endDate) {
      return query
        .where('date', '>=', startDate)
        .where('date', '<=', endDate);
    }
    return query;
  }
}
// import { transactionRepository } from 'src/transactions/Transaction.repository';

// @Injectable
// export class Transaction {
//   constructor(private readonly transactionRepository: transactionRepository) {}
//   static async transaction(walletId, amount, type) {
//     try {
//       const operation = {
//         walletId,
//         amount,
//         type,
//       };

//       return this.transactionRepository.create(operation);
//     } catch (error) {
//       return new BadRequestException(error);
//     }
//   }
// }

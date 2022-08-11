const { validationResult } = require("express-validator");
const paymentSchema = require("../models/payment");

const createPayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(405).json({ error: "Invalid inputs  " });
  }

  //62f4e5fbe33880820e63feae
  const { paid, userId } = req.body;
  const createPayment = new paymentSchema({
    paid,
    refund: 0,
    date: Date.now(),
    userId: userId,
  });
  console.log(createPayment);
  try {
    await createPayment.save();
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({
    data: createPayment,
  });
};

const getPayments = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(405).json({ error: "Invalid inputs  " });
  }
  const { userId } = req.params;
  let payments;
  try {
    payments = await paymentSchema.find({ userId: userId }).sort("-date");
  } catch (err) {
    const error = new HttpError(
      "Fetching payments failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    payments: payments.map((av) => av.toObject({ getters: true })),
  });
};

const updatePayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(501).json({ error: "Input invalid" });
  }
  const { idPayment } = req.params;
  const { refund } = req.body;
  console.log(refund, idPayment);
  let payment;
  try {
    payment = await paymentSchema.findOne({ _id: idPayment });
  } catch (err) {
    res.status(501).json({ error: "couldnt retrive the payment" });
  }
  payment.refund = payment.refund + parseFloat(refund);
  try {
    await payment.save();
  } catch (err) {
    res.status(501).json({ error: "couldnt update the payment" });
    return next(error);
  }
  res.status(200).json({ payment: payment.toObject({ getters: true }) });
};

const getMetrics = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(405).json({ error: "Invalid inputs  " });
  }
  const { userId } = req.params;
  let payments;
  try {
    payments = await paymentSchema.find({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching payments failed, please try again later.",
      500
    );
    return next(error);
  }
  const total = payments.reduce((previousValue, currentValue) => previousValue + currentValue.paid - currentValue.refund )
  const length =   payments.length;
  const medium = total/length
  const metrics  ={
    total, length, medium
  }
  res.status(201).json({data:metrics});
}

exports.createPayment = createPayment;
exports.getPayments = getPayments;
exports.updatePayment = updatePayment;
exports.getMetrics = getMetrics;
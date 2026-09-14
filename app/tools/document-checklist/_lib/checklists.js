// General organising prompts, not a statement of mandatory legal requirements.
// Loan categories: https://appln.hdfc.bank.in/loanapplication/instructions.php
// Tenancy context: https://mohua.gov.in/upload/uploadfiles/files/Model-Tenancy-Act-English-02_06_2021.pdf
export const checklists = {
  buying: {
    title: "Buying",
    description:
      "Bring together your details, the seller’s records and the paperwork for your purchase.",
    groups: [
      {
        id: "buyer",
        title: "Buyer Documents",
        documents: [
          {
            id: "buyer-identity",
            title: "Identity and address proof",
            description:
              "Keep current proof for each buyer, using documents accepted by the recipient.",
          },
          {
            id: "buyer-tax",
            title: "PAN or applicable tax declaration",
            description:
              "Confirm which tax identification document or declaration applies to your transaction.",
          },
        ],
      },
      {
        id: "seller",
        title: "Seller Documents",
        documents: [
          {
            id: "seller-identity",
            title: "Seller identity proof",
            description:
              "Collect the seller’s identification to compare with the ownership records.",
          },
          {
            id: "seller-authority",
            title: "Authority to sell",
            description:
              "If a representative is signing, have their authority reviewed by a professional.",
            conditional: true,
          },
        ],
      },
      {
        id: "property",
        title: "Property Documents",
        documents: [
          {
            id: "property-title",
            title: "Title deed and ownership history",
            description:
              "Gather the current deed and earlier transfer records for a professional title review.",
          },
          {
            id: "property-approvals",
            title: "Plans and approval records",
            description:
              "Ask which sanctioned plans and completion or occupancy records apply to this property.",
            conditional: true,
          },
          {
            id: "property-dues",
            title: "Property tax and dues records",
            description:
              "Review available payment receipts and statements for outstanding property-related dues.",
          },
        ],
      },
      {
        id: "loan",
        title: "Loan Documents",
        documents: [
          {
            id: "loan-income",
            title: "Income proof and bank statements",
            description:
              "For a financed purchase, collect the income records and statement period your lender requests.",
            conditional: true,
          },
          {
            id: "loan-sanction",
            title: "Loan application and sanction letter",
            description:
              "Keep the application and, once issued, the lender’s sanction terms for review.",
            conditional: true,
          },
        ],
      },
      {
        id: "registration",
        title: "Registration Documents",
        documents: [
          {
            id: "registration-deed",
            title: "Reviewed sale deed",
            description:
              "Arrange review of the deed, party details, property description and agreed consideration.",
          },
          {
            id: "registration-receipts",
            title: "Duty and registration payment records",
            description:
              "Retain payment acknowledgements where applicable; confirm amounts with the relevant authority.",
            conditional: true,
          },
          {
            id: "registration-support",
            title: "Appointment and supporting papers",
            description:
              "Confirm the appointment, witness papers and other documents requested for your registration.",
            conditional: true,
          },
        ],
      },
    ],
  },
  selling: {
    title: "Selling",
    description:
      "Organise your ownership records and prepare the documents for a clear handover.",
    groups: [
      {
        id: "identity",
        title: "Seller Identity Documents",
        documents: [
          {
            id: "identity-proof",
            title: "Identity and address proof",
            description:
              "Keep identification for each seller named in the transaction.",
          },
          {
            id: "identity-tax",
            title: "Tax identification details",
            description:
              "Confirm which tax details or declarations the transaction requires.",
          },
        ],
      },
      {
        id: "ownership",
        title: "Ownership Documents",
        documents: [
          {
            id: "ownership-deed",
            title: "Title deed and earlier transfer records",
            description:
              "Organise the documents through which you acquired the property.",
          },
          {
            id: "ownership-authority",
            title: "Co-owner consent or representative authority",
            description:
              "Have the relevant consent or authorisation reviewed if others share ownership or sign for you.",
            conditional: true,
          },
        ],
      },
      {
        id: "property",
        title: "Property Documents",
        documents: [
          {
            id: "property-plans",
            title: "Plans and approval records",
            description:
              "Collect available sanctioned plans and approval records relevant to the property.",
            conditional: true,
          },
          {
            id: "property-possession",
            title: "Possession or handover records",
            description:
              "Keep the possession letter or earlier handover record, if one was issued.",
            conditional: true,
          },
          {
            id: "property-loan",
            title: "Existing loan statement or release records",
            description:
              "If the property is financed, confirm outstanding amounts and release arrangements with your lender.",
            conditional: true,
          },
        ],
      },
      {
        id: "dues",
        title: "Tax / Utility Documents",
        documents: [
          {
            id: "dues-tax",
            title: "Property tax receipts",
            description:
              "Collect recent property tax payment records and check for unpaid amounts.",
          },
          {
            id: "dues-utilities",
            title: "Utility and maintenance statements",
            description:
              "Keep available bills and payment records to help agree the handover balance.",
          },
        ],
      },
      {
        id: "sale",
        title: "Sale Documents",
        documents: [
          {
            id: "sale-agreement",
            title: "Agreement to sell",
            description:
              "Keep the agreed price, payment schedule and conditions in the reviewed agreement.",
          },
          {
            id: "sale-deed",
            title: "Sale deed and registration record",
            description:
              "Retain the reviewed deed and the registration record once issued.",
          },
          {
            id: "sale-handover",
            title: "Payment and handover acknowledgements",
            description:
              "Record payments received and the agreed transfer of keys and documents.",
          },
        ],
      },
    ],
  },
  renting: {
    title: "Renting",
    description:
      "Keep the people, property and agreement details together before your move.",
    groups: [
      {
        id: "tenant",
        title: "Tenant Documents",
        documents: [
          {
            id: "tenant-identity",
            title: "Tenant identity proof",
            description:
              "Keep identification for the tenants named in the agreement.",
          },
          {
            id: "tenant-address",
            title: "Address and contact details",
            description:
              "Prepare current contact and address details for the rental paperwork.",
          },
          {
            id: "tenant-income",
            title: "Employment or income confirmation",
            description:
              "Provide only the relevant records if requested and agreed with the landlord.",
            conditional: true,
          },
        ],
      },
      {
        id: "landlord",
        title: "Landlord Documents",
        documents: [
          {
            id: "landlord-identity",
            title: "Landlord identity and contact details",
            description:
              "Record the identity and contact details of the person entering the agreement.",
          },
          {
            id: "landlord-authority",
            title: "Ownership or authority to let",
            description:
              "Ask for evidence of ownership or the representative’s authority to rent the premises.",
          },
        ],
      },
      {
        id: "property",
        title: "Property Documents",
        documents: [
          {
            id: "property-inventory",
            title: "Inventory and condition record",
            description:
              "Agree a record of fittings, furnishings and existing damage before handover.",
          },
          {
            id: "property-utilities",
            title: "Utility bills and meter readings",
            description:
              "Record opening meter readings and agree responsibility for existing utility balances.",
          },
        ],
      },
      {
        id: "agreement",
        title: "Rental Agreement Documents",
        documents: [
          {
            id: "agreement-signed",
            title: "Reviewed and signed rental agreement",
            description:
              "Check the rent, term, deposit, notice and maintenance terms before signing.",
          },
          {
            id: "agreement-payments",
            title: "Rent and deposit receipts",
            description:
              "Retain acknowledgements for the payments you make or receive.",
          },
          {
            id: "agreement-formalities",
            title: "Applicable stamping or registration records",
            description:
              "Check local requirements with the relevant authority and retain the resulting records.",
            conditional: true,
          },
        ],
      },
    ],
  },
};

export const storageKey = "genvilla-document-checklist-v1";
export const modes = Object.keys(checklists);
export const documentIds = (mode) =>
  checklists[mode].groups.flatMap((group) =>
    group.documents.map((document) => document.id),
  );
export const emptyProgress = () => ({
  version: 1,
  mode: "buying",
  completed: { buying: [], selling: [], renting: [] },
});

export function restoreProgress(serialized) {
  const clean = emptyProgress();
  try {
    const saved = JSON.parse(serialized);
    if (!saved || saved.version !== 1) return clean;
    if (modes.includes(saved.mode)) clean.mode = saved.mode;
    for (const mode of modes) {
      const ids = documentIds(mode);
      if (Array.isArray(saved.completed?.[mode])) {
        clean.completed[mode] = [
          ...new Set(saved.completed[mode].filter((id) => ids.includes(id))),
        ];
      }
    }
  } catch {
    /* Invalid stored data starts a clean checklist. */
  }
  return clean;
}

export function updateProgress(state, action) {
  if (action.type === "mode")
    return modes.includes(action.mode)
      ? { ...state, mode: action.mode }
      : state;
  const mode = state.mode;
  const ids = documentIds(mode);
  let completed = state.completed[mode];
  if (action.type === "all") completed = ids;
  else if (action.type === "reset") completed = [];
  else if (action.type === "toggle" && ids.includes(action.id)) {
    completed = completed.includes(action.id)
      ? completed.filter((id) => id !== action.id)
      : [...completed, action.id];
  } else return state;
  return { ...state, completed: { ...state.completed, [mode]: completed } };
}

export function progressFor(state) {
  const total = documentIds(state.mode).length;
  const completed = state.completed[state.mode].length;
  return { total, completed, percent: Math.round((completed / total) * 100) };
}

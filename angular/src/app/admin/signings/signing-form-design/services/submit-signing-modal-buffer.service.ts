export class SubmitSigningModalBuffer {

    isSaveBuffer = false;
    signers: Participant[] = [];
    viewers: Participant[] = [];

    public getMessage(id: string): string {
        const findParticipant = (signer) => {
            return signer.id === id;
        };
        const findSigner = this.signers.find(findParticipant);
        const findViewer = this.viewers.find(findParticipant);

        return findSigner ? findSigner.message
            : findViewer ? findViewer.message : '';
    }
}

export class Participant {
    id!: string;
    fullName!: string | undefined;
    email!: string | undefined;
    subject!: string | undefined;
    message!: string | undefined;
    controlsAmount!: number | undefined;
}
